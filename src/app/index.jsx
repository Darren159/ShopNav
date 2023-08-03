import { useState, useContext, useEffect } from "react";
import {
  Alert,
  ActivityIndicator,
  Text,
  View,
  StyleSheet,
  Switch,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Entypo, FontAwesome5 } from "@expo/vector-icons";
import { MallContext } from "./context/mallProvider";
import dijkstra from "../utils/dijkstra";
import fetchNodes from "../services/fetchNodes";
import StoreInput from "../components/StoreInput";
import Floorplan from "../components/Floorplan";
import LevelButtons from "../components/LevelButtons";
import fetchNodeId from "../services/fetchNodeId";
import fetchStoreList from "../services/fetchStoreList";

// The Directory function component provides a user interface and functionality
// for fetching and displaying a directory of a specific mall.
export default function Directory() {
  const { currentMall } = useContext(MallContext);
  const [path, setPath] = useState([]);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [startStoreName, setStartStoreName] = useState("");
  const [endStoreName, setEndStoreName] = useState("");
  const [graph, setGraph] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isElevatorOnly, setIsElevatorOnly] = useState(false);
  const [storeList, setStoreList] = useState([]);

  // UseEffect to fetch nodes based on the current mall context.
  useEffect(() => {
    const fetchData = async () => {
      if (currentMall) {
        try {
          // Fetch nodes.
          const nodes = await fetchNodes(currentMall);

          // Set fetched nodes to graph state.
          setGraph(nodes);

          // Reset path state.
          setPath([]);

          // Fetch the list of stores at the current mall and level.
          const stores = await fetchStoreList(currentMall);

          // Update storeList state.
          setStoreList(stores);
        } catch (error) {
          // On catch, alert the user with an error message.
          Alert.alert("Error", error.message, [{ text: "OK" }], {
            cancelable: false,
          });
        }
      }
    };
    fetchData();
  }, [currentMall]);

  // Async function to calculate the shortest path between two stores.
  const calculatePath = async () => {
    try {
      // Set loading to true as the calculation starts.
      setIsLoading(true);

      // Fetch start node ID.
      const startNodeId = await fetchNodeId(currentMall, startStoreName);

      // Fetch end node ID.
      const endNodeId = await fetchNodeId(currentMall, endStoreName);

      // Calculate shortest path using Dijkstra's algorithm.
      const shortestPath = dijkstra(
        graph,
        startNodeId,
        endNodeId,
        isElevatorOnly
      );

      // Set calculated path to path state. If shortestPath is null, set path to an empty array.
      setPath(shortestPath !== null ? shortestPath : []);
    } catch (error) {
      // On catch, alert the user with an error message.
      Alert.alert("Error", error.message, [{ text: "OK" }], {
        cancelable: false,
      });
    } finally {
      // Once the calculation ends, set loading to false.
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.row}>
        <View style={styles.inputContainer}>
          <StoreInput
            icon="circle"
            storeName={startStoreName}
            setStoreName={setStartStoreName}
            placeholder="Enter starting point"
            storeList={storeList}
          />
          <Entypo
            name="dots-three-vertical"
            size={24}
            color="black"
            style={styles.iconStyle}
          />
          <StoreInput
            icon="map-pin"
            storeName={endStoreName}
            setStoreName={setEndStoreName}
            placeholder="Enter destination"
            storeList={storeList}
          />
        </View>
        <View style={{ width: 75 }}>
          <Text style={{ textAlign: "center" }}>Elevators Only</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isElevatorOnly ? "#f5dd4b" : "#f4f3f4"}
            onValueChange={(value) => setIsElevatorOnly(value)}
            value={isElevatorOnly}
          />
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator
                size="large"
                color="#5500dc"
                testID="button-loading"
              />
              <Text style={{ fontSize: 12 }}>Navigating...</Text>
            </View>
          ) : (
            <FontAwesome5.Button
              name="directions"
              backgroundColor="#515151"
              borderRadius={13}
              onPress={calculatePath}
            >
              Go!
            </FontAwesome5.Button>
          )}
        </View>
      </View>
      {currentMall ? (
        <>
          <View style={styles.mapContainer}>
            <Floorplan
              currentMall={currentMall}
              currentLevel={currentLevel}
              path={path}
              storeList={storeList}
            />
          </View>
          <LevelButtons
            currentMall={currentMall}
            currentLevel={currentLevel}
            setCurrentLevel={setCurrentLevel}
          />
        </>
      ) : (
        <ActivityIndicator
          size="large"
          color="#5500dc"
          style={styles.largeLoadingContainer}
          testID="map-loading"
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaView: { flex: 1 },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    flex: 0.15,
    zIndex: 1,
  },
  loadingContainer: { alignItems: "center" },
  largeLoadingContainer: { flex: 1 },
  inputContainer: {
    alignItems: "center",
    flex: 0.85,
  },
  iconStyle: {
    marginVertical: 5,
  },
  mapContainer: {
    flex: 0.85,
  },
});
