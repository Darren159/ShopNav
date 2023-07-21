import { useState, useEffect, useContext } from "react";
import { Button, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Svg, Line } from "react-native-svg";
import MallPicker from "../components/MallPicker";
import dijkstra from "../utils/dijkstra";
import getGraph from "../services/getGraph";
import getNodeIDFromStoreName from "../services/getNodeIDFromStoreName";
import StoreInput from "../components/StoreInput";
import LevelButtons from "../components/LevelButtons";
import Floorplan from "../components/Floorplan";
import useStoreInput from "../hooks/useStoreInput";
import { MallContext } from "../context/MallProvider";

export default function Navigation() {
  const { malls, currentMall, setCurrentMall } = useContext(MallContext);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [graph, setGraph] = useState({});
  const [path, setPath] = useState([]);

  const startStore = useStoreInput(currentMall);
  const endStore = useStoreInput(currentMall);
  useEffect(() => {
    if (currentMall) {
      getGraph(currentMall).then((nodes) => setGraph(nodes));
    }
  }, [currentMall]);

  const calculatePath = async () => {
    const startNodeId = await startStore.handleClick(getNodeIDFromStoreName);
    const endNodeId = await endStore.handleClick(getNodeIDFromStoreName);

    if (startNodeId && endNodeId) {
      const shortestPath = dijkstra(graph, startNodeId, endNodeId);
      setPath(shortestPath !== null ? shortestPath : []);
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
          storeName={startStore.storeName}
          setStoreName={startStore.setStoreName}
          error={startStore.storeError}
          placeholder="Enter start store"
        />
        <StoreInput
          storeName={endStore.storeName}
          setStoreName={endStore.setStoreName}
          error={endStore.storeError}
          placeholder="Enter end store"
        />
        <View style={styles.buttonContainer}>
          <Button title="Get Directions" onPress={calculatePath} />
        </View>
      </View>
      <View style={styles.mapContainer}>
        {currentMall && (
          <Floorplan currentMall={currentMall} currentLevel={currentLevel}>
            <Svg
              style={styles.overlayPath}
              height="100%"
              width="100%"
              viewBox="0 0 760 600"
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
            </Svg>
          </Floorplan>
        )}
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
    flex: 0.3,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
  },
  mapContainer: {
    flex: 0.7,
  },
  overlayPath: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
