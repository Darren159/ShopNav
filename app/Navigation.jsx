import { useState, useEffect } from "react";
import { Button, View, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Svg, Line, SvgUri } from "react-native-svg";
import SvgPanZoom from "react-native-svg-pan-zoom";
import MallPicker from "../Components/MallPicker";
import dijkstra from "../services/dijkstra";
import {
  getNodeIDFromStoreName,
  getGraph,
  useMalls,
} from "../services/databaseService";
import fetchSvgUrl from "../services/storageService";
import StoreInput from "../Components/StoreInput";
import LevelButtons from "../Components/LevelButtons";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

export default function Navigation() {
  const { malls, currentMall, setCurrentMall } = useMalls();
  const [currentLevel, setCurrentLevel] = useState(1);
  const [startStoreName, setStartStoreName] = useState("");
  const [endStoreName, setEndStoreName] = useState("");
  const [startStoreError, setStartStoreError] = useState(false);
  const [endStoreError, setEndStoreError] = useState(false);
  const [graph, setGraph] = useState({});
  const [path, setPath] = useState([]);
  const [svgUrl, setSvgUrl] = useState(null);

  useEffect(() => {
    if (currentMall) {
      fetchSvgUrl(currentMall, currentLevel).then((url) => setSvgUrl(url));
    }
  }, [currentMall, currentLevel]);

  useEffect(() => {
    if (currentMall) {
      getGraph(currentMall).then((nodes) => setGraph(nodes));
    }
  }, [currentMall]);

  const handleClick = async () => {
    // Clear the previous errors
    setStartStoreError(false);
    setEndStoreError(false);

    try {
      const startNodeId = await getNodeIDFromStoreName(
        currentMall,
        startStoreName
      );
      const endNodeId = await getNodeIDFromStoreName(currentMall, endStoreName);

      if (startNodeId && endNodeId) {
        const shortestPath = dijkstra(graph, startNodeId, endNodeId);
        if (shortestPath !== null) {
          setPath(shortestPath);
        } else {
          setPath([]);
        }
      }
    } catch (error) {
      if (error.message === "Start store does not exist") {
        setStartStoreError(true);
      }
      if (error.message === "End store does not exist") {
        setEndStoreError(true);
      }
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          flex: 0.3,
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
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
        <View style={{ width: 150 }}>
          <Button title="Get Directions" onPress={handleClick} />
        </View>
      </View>
      <View style={{ flex: 0.7, justifyContent: "flex-end" }}>
        <SvgPanZoom
          key={svgUrl}
          canvasHeight={screenHeight * 0.4}
          canvasWidth={screenWidth}
          minScale={0.5}
          maxScale={3}
          initialZoom={1.0}
          style={{ justifyContent: "flex-end" }}
        >
          {svgUrl && <SvgUri uri={svgUrl} width="100%" height="100%" />}
          <Svg height="610" width="773" viewBox="0 0 773 610">
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
        </SvgPanZoom>
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
