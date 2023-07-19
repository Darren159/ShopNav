import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { SvgUri } from "react-native-svg";
import { ActivityIndicator } from "react-native";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { fetchSvgUrl } from "../services/storageService";

export default function Floorplan({ currentMall, currentLevel, children }) {
  const [svgUrl, setSvgUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (currentMall) {
      setIsLoading(true);
      fetchSvgUrl(currentMall, currentLevel).then((url) => {
        setSvgUrl(url);
        setIsLoading(false); // set loading state to false after SVG is fetched
      });
    }
  }, [currentMall, currentLevel]);

  const context = useSharedValue({ x: 0, y: 0 });
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onStart(() => {
      context.value = { x: translateX.value, y: translateY.value };
    })
    .onUpdate((event) => {
      const newX = event.translationX + context.value.x;
      const newY = event.translationY + context.value.y;
      translateX.value = Math.min(Math.max(newX, -100), 200);
      translateY.value = Math.min(Math.max(newY, 0), 100);
    });

  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);

  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = savedScale.value * e.scale;
    })
    .onEnd(() => {
      savedScale.value = scale.value;
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  const composed = Gesture.Simultaneous(pinchGesture, panGesture);

  return isLoading ? (
    <ActivityIndicator size="large" /> // show spinner if isLoading is true
  ) : (
    <GestureDetector gesture={composed}>
      <Animated.View style={animatedStyle}>
        <SvgUri
          key={currentLevel}
          uri={svgUrl}
          width="100%"
          height="100%"
          style={{ backgroundColor: "#33AAFF" }}
        />
        {children}
      </Animated.View>
    </GestureDetector>
  );
}

Floorplan.propTypes = {
  currentMall: PropTypes.string.isRequired,
  currentLevel: PropTypes.number.isRequired,
  children: PropTypes.node,
};

Floorplan.defaultProps = {
  children: null,
};
