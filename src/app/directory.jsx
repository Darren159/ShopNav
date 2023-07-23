import { useState, useEffect, useContext } from "react";
import { View, StyleSheet, ActivityIndicator, Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Line, Path } from "react-native-svg";
import { useRouter } from "expo-router";
import useStoreList from "../hooks/useStoreList";
import dijkstra from "../utils/dijkstra";
import fetchNodes from "../services/fetchNodes";
import fetchStore from "../services/fetchStore";
import StoreInput from "../components/StoreInput";
import useStoreInput from "../hooks/useStoreInput";
import Floorplan from "../components/Floorplan";
import { MallContext } from "./context/mallProvider";
import LevelButtons from "../components/LevelButtons";

export default function Directory() {
  const { currentMall } = useContext(MallContext);
  const [graph, setGraph] = useState({});
  const [path, setPath] = useState([]);
  const { stores } = useStoreList(currentMall);
  const [currentLevel, setCurrentLevel] = useState(1);
  const startStore = useStoreInput(currentMall);
  const endStore = useStoreInput(currentMall);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (currentMall) {
      setIsLoading(true);
      fetchNodes(currentMall).then((nodes) => setGraph(nodes));
      setIsLoading(false);
    }
  }, [currentMall]);

  const calculatePath = async () => {
    setIsLoading(true);
    const startNodeId = `${await startStore.handleClick(fetchStore)}-node`;
    const endNodeId = `${await endStore.handleClick(fetchStore)}-node`;

    if (startNodeId && endNodeId) {
      const shortestPath = dijkstra(graph, startNodeId, endNodeId);
      setPath(shortestPath !== null ? shortestPath : []);
    }

    setIsLoading(false);
  };

  // for navigation to storeSearch

  return (
    <SafeAreaView style={styles.safeAreaView}>
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#5500dc" />
        </View>
      )}
      {currentMall && (
        <>
          <View style={styles.row}>
            <View style={styles.inputContainer}>
              <StoreInput
                storeName={startStore.storeName}
                setStoreName={startStore.setStoreName}
                error={startStore.storeError}
                placeholder="Enter starting point"
              />
              <StoreInput
                storeName={endStore.storeName}
                setStoreName={endStore.setStoreName}
                error={endStore.storeError}
                placeholder="Enter destination"
              />
              <Button title="Get Directions" onPress={calculatePath} />
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
                      onPress={() =>
                        router.push({
                          pathname: "/placeDetails",
                          params: { locName: store.id },
                        })
                      }
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
  loadingOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0)", // transparent background
  },
});
