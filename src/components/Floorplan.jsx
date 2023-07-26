import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Svg, SvgUri, Line, Path } from "react-native-svg";
import { ActivityIndicator, Alert, StyleSheet } from "react-native";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { router } from "expo-router";
import fetchSvgUrl from "../services/fetchSvgUrl";
import fetchStoreList from "../services/fetchStoreList";

export default function Floorplan({ currentMall, currentLevel, path }) {
  const [svgUrl, setSvgUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [reload, setReload] = useState(false);
  const [storeList, setStoreList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const url = await fetchSvgUrl(currentMall, currentLevel);
        setSvgUrl(url);
        const stores = await fetchStoreList(currentMall);
        setStoreList(stores);
      } catch (err) {
        Alert.alert(
          "Error in fetching map data",
          "Try reloading the app with better internet connection",
          [
            {
              text: "Reload",
              onPress: () => {
                setReload((prevReload) => !prevReload);
              },
            },
            { text: "OK" },
          ]
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [currentMall, currentLevel, reload]);

  const context = useSharedValue({ x: 0, y: 0 });
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .withTestId("pan")
    .onStart(() => {
      context.value = { x: translateX.value, y: translateY.value };
    })
    .onUpdate((event) => {
      const newX = event.translationX + context.value.x;
      const newY = event.translationY + context.value.y;
      translateX.value = Math.min(Math.max(newX, -200), 200);
      translateY.value = Math.min(Math.max(newY, -200), 200);
    });

  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);

  const pinchGesture = Gesture.Pinch()
    .withTestId("pinch")
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
    <ActivityIndicator
      size="large"
      color="#5500dc"
      style={styles.loadingContainer}
      testID="loading"
    />
  ) : (
    <GestureDetector gesture={composed}>
      <Animated.View style={animatedStyle}>
        <SvgUri key={currentLevel} uri={svgUrl} width="100%" height="100%" />
        <Svg
          style={styles.overlay}
          height="100%"
          width="100%"
          viewBox="0 0 600 760"
        >
          {path
            .filter((node) => node.level === currentLevel)
            .map((node, index, levelNodes) => {
              if (index < levelNodes.length - 1) {
                const currentNode = node;
                const nextNode = levelNodes[index + 1];
                const key = `${currentNode.coordinates.x}-${currentNode.coordinates.y}-${nextNode.coordinates.x}-${nextNode.coordinates.y}`;
                return (
                  <Line
                    x1={currentNode.coordinates.x}
                    y1={currentNode.coordinates.y}
                    x2={nextNode.coordinates.x}
                    y2={nextNode.coordinates.y}
                    stroke="red"
                    strokeWidth="2"
                    key={key}
                  />
                );
              }
              return null;
            })}
          {storeList
            .filter((store) => store.level === currentLevel)
            .map((store) => (
              <Path
                d={store.coordinates}
                fill="none"
                stroke="transparent"
                strokeWidth="1"
                key={store.id}
                onPress={() =>
                  router.push({
                    pathname: "/storeDetails",
                    params: {
                      locName: store.id,
                      promoInfo: store.promo ? store.promo : "",
                      storeName: store.name,
                    },
                  })
                }
              />
            ))}
        </Svg>
      </Animated.View>
    </GestureDetector>
  );
}

Floorplan.propTypes = {
  currentMall: PropTypes.string.isRequired,
  currentLevel: PropTypes.number.isRequired,
  path: PropTypes.arrayOf(
    PropTypes.shape({
      level: PropTypes.number.isRequired,
      coordinates: PropTypes.shape({
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired,
      }).isRequired,
    })
  ).isRequired,
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  loadingContainer: {
    flex: 1,
  },
});
