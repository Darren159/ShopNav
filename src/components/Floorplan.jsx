import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { SvgUri } from "react-native-svg";
import { ActivityIndicator, Alert } from "react-native";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import fetchSVGUrl from "../services/fetchSVGUrl";

export default function Floorplan({ currentMall, currentLevel, children }) {
  const [svgUrl, setSVGUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (currentMall) {
          setIsLoading(true);
          setError(null); // reset the error before fetching
          const url = await fetchSVGUrl(currentMall, currentLevel);
            
          // try error fetching data
          // a;

           setSVGUrl(url);
          
          // set loading state to false after SVG is fetched
          setIsLoading(false);
        }
      } catch (err) {
        setError(err)
        setIsLoading(false)
      }
    }
    fetchData();
  }, [currentMall, currentLevel,reload]);

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

  // handling error fetching floorplan data
  useEffect(() => {
    if (error) {
      Alert.alert(
        "Error in fetching map data",
        "Try reloading the app with better internet connection",
        [
          {
            text: 'Reload',
            onPress: () => {
              setReload(prevReload => !prevReload); // use functional update here as well
              console.log("close map fetch error & reload")
            }
          }
        ]
      )
    }
  }, [error]); // this effect depends on error and reload

  return isLoading ? (
    <ActivityIndicator size="large" /> // show spinner if isLoading is true
  ) : (
    <GestureDetector gesture={composed}>
      <Animated.View style={animatedStyle}>
        <SvgUri key={currentLevel} uri={svgUrl} width="100%" height="100%" />
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
