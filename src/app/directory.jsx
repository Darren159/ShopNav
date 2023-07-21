import { useState, useEffect, useContext } from "react";
import { Button, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Line, Path } from "react-native-svg";
import { Link } from "expo-router";
import useStoreList from "../hooks/useStoreList";
import dijkstra from "../utils/dijkstra";
import getGraph from "../services/getGraph";
import getNodeIDFromStoreName from "../services/getNodeIDFromStoreName";
import StoreInput from "../components/StoreInput";
import useStoreInput from "../hooks/useStoreInput";
import Floorplan from "../components/Floorplan";
import MallPicker from "../components/MallPicker";
import { MallContext } from "./context/mallProvider";
import LevelButtons from "../components/LevelButtons";

export default function Directory() {
  const { malls, currentMall, setCurrentMall } = useContext(MallContext);
  const [graph, setGraph] = useState({});
  const [path, setPath] = useState([]);
  const { stores } = useStoreList(currentMall);
  const [currentLevel, setCurrentLevel] = useState(1);
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
    <SafeAreaView style={styles.safeAreaView}>
      {currentMall && (
        <>
          <View style={styles.row}>
            <View style={styles.inputContainer}>
              <MallPicker
                currentMall={currentMall}
                setCurrentMall={setCurrentMall}
                malls={malls}
              />
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
              <Button title="Get Directions" onPress={calculatePath} />
            </View>
            <View style={styles.sideButtonContainer}>
              <Link href="/storeSearch" asChild>
                <Button title="Store Search" />
              </Link>
            </View>
          </View>
          <View style={styles.mapContainer}>
            <Floorplan currentMall={currentMall} currentLevel={currentLevel}>
              <Svg
                style={styles.overlay}
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
                {stores
                  .filter((store) => store.level === currentLevel)
                  .map((store) => (
                    <Path
                      d={store.coordinates}
                      fill="none"
                      stroke="transparent"
                      strokeWidth="1"
                      key={store.id}
                      // onPress={() => console.log("Store clicked:", store.id)}
                    />
                  ))}
              </Svg>
            </Floorplan>
          </View>
          <LevelButtons
            currentMall={currentMall}
            currentLevel={currentLevel}
            setCurrentLevel={setCurrentLevel}
          />
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaView: { flex: 1 },
  inputContainer: {
    flex: 0.2,
    flexDirection: "column",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  mapContainer: {
    flex: 0.8,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
