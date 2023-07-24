import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Svg, SvgUri, Line, Path } from "react-native-svg";
import { View, ActivityIndicator, Alert, StyleSheet } from "react-native";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { router } from "expo-router";
import fetchSVGUrl from "../services/fetchSVGUrl";

export default function Floorplan({
  currentMall,
  currentLevel,
  stores,
  path,
  graph,
}) {
  const [svgUrl, setSVGUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (currentMall) {
          setIsLoading(true);
          const url = await fetchSVGUrl(currentMall, currentLevel);
          setSVGUrl(url);
        }
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
      translateX.value = Math.min(Math.max(newX, -100), 200);
      translateY.value = Math.min(Math.max(newY, -200), 100);
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
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#5500dc" />
    </View>
  ) : (
    <GestureDetector gesture={composed}>
      <Animated.View style={animatedStyle}>
        <SvgUri
          key={currentLevel}
          uri={svgUrl}
          width="100%"
          height="100%"
          testID="svg-image"
        />
        <Svg
          style={styles.overlay}
          height="100%"
          width="100%"
          viewBox="0 0 600 760"
        >
          {path
            .filter((node) => graph[node].level === currentLevel)
            .map((node, index, levelNodes) => {
              if (index < levelNodes.length - 1) {
                const currentNode = graph[node];
                const nextNode = graph[levelNodes[index + 1]];
                return (
                  <Line
                    x1={currentNode.coordinates.x}
                    y1={currentNode.coordinates.y}
                    x2={nextNode.coordinates.x}
                    y2={nextNode.coordinates.y}
                    stroke="red"
                    strokeWidth="2"
                    key={node}
                  />
                );
              }
              return null;
            })}
          {stores
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
                    params: { locName: store.id },
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
  stores: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      level: PropTypes.number.isRequired,
      coordinates: PropTypes.string.isRequired,
    })
  ).isRequired,
  path: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  graph: PropTypes.objectOf(
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
    justifyContent: "center",
    alignItems: "center",
  },
});
