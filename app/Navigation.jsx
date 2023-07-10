import { useState, useEffect } from "react";
import { Button, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Svg, Line } from "react-native-svg";
import MallPicker from "../Components/MallPicker";
import dijkstra from "../services/dijkstra";
import {
  getNodeIDFromStoreName,
  getGraph,
  useMalls,
} from "../services/databaseService";
import StoreInput from "../Components/StoreInput";
import LevelButtons from "../Components/LevelButtons";
import Floorplan from "../Components/Floorplan";

export default function Navigation() {
  const { malls, currentMall, setCurrentMall } = useMalls();
  const [currentLevel, setCurrentLevel] = useState(1);
  const [startStoreName, setStartStoreName] = useState("");
  const [endStoreName, setEndStoreName] = useState("");
  const [startStoreError, setStartStoreError] = useState(false);
  const [endStoreError, setEndStoreError] = useState(false);
  const [graph, setGraph] = useState({});
  const [path, setPath] = useState([]);

  useEffect(() => {
    if (currentMall) {
      getGraph(currentMall).then((nodes) => setGraph(nodes));
    }
  }, [currentMall]);

  const handleClick = async () => {
    // Clear the previous errors
    setStartStoreError(false);
    setEndStoreError(false);

    let startNodeId;
    let endNodeId;
    try {
      startNodeId = await getNodeIDFromStoreName(currentMall, startStoreName);
    } catch (error) {
      setStartStoreError(true);
    }
    try {
      endNodeId = await getNodeIDFromStoreName(currentMall, endStoreName);
    } catch (error) {
      setEndStoreError(true);
    }

    if (startNodeId && endNodeId) {
      const shortestPath = dijkstra(graph, startNodeId, endNodeId);
      if (shortestPath !== null) {
        setPath(shortestPath);
      } else {
        setPath([]);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
        {currentMall && (
          <MallPicker
            currentMall={currentMall}
            setCurrentMall={setCurrentMall}
            malls={malls}
          />
        )}
        <StoreInput
          storeName={startStoreName}
          setStoreName={setStartStoreName}
          error={startStoreError}
          placeholder="Enter start store"
        />
        <StoreInput
          storeName={endStoreName}
          setStoreName={setEndStoreName}
          error={endStoreError}
          placeholder="Enter end store"
        />
        <View style={styles.buttonContainer}>
          <Button title="Get Directions" onPress={handleClick} />
        </View>
      </View>
      <View style={styles.mapContainer}>
        {currentMall && (
          <Floorplan currentMall={currentMall} currentLevel={currentLevel} />
        )}
        <Svg
          style={styles.overlayPath}
          height="100%"
          width="100%"
          viewBox="0 0 760 600"
        >
          {path.map((node, index) => {
            if (index < path.length - 1) {
              const currentNode = graph[node];
              const nextNode = graph[path[index + 1]];
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
        </Svg>
      </View>
      {currentMall && (
        <LevelButtons
          currentMall={currentMall}
          currentLevel={currentLevel}
          setCurrentLevel={setCurrentLevel}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inputContainer: {
    flex: 0.1,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
  },
  mapContainer: {
    flex: 0.9,
  },
  overlayPath: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
