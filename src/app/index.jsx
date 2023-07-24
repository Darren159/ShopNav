import { useState, useContext } from "react";
import { ActivityIndicator, Alert, Text, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Entypo, FontAwesome5 } from "@expo/vector-icons";
import useStoreList from "../hooks/useStoreList";
import dijkstra from "../utils/dijkstra";
import fetchNodes from "../services/fetchNodes";
import StoreInput from "../components/StoreInput";
import useStoreInput from "../hooks/useStoreInput";
import Floorplan from "../components/Floorplan";
import { MallContext } from "./context/mallProvider";
import LevelButtons from "../components/LevelButtons";

export default function Directory() {
  const { currentMall } = useContext(MallContext);
  const [path, setPath] = useState([]);
  const { stores } = useStoreList(currentMall);
  const [currentLevel, setCurrentLevel] = useState(1);
  const startStore = useStoreInput(currentMall);
  const endStore = useStoreInput(currentMall);
  const [graph, setGraph] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const calculatePath = async () => {
    try {
      setIsLoading(true);
      const startNodeId = `${await startStore.handleStore()}-node`;
      const endNodeId = `${await endStore.handleStore()}-node`;
      const nodes = await fetchNodes(currentMall);
      setGraph(nodes);
      const shortestPath = dijkstra(nodes, startNodeId, endNodeId);
      setPath(shortestPath !== null ? shortestPath : []);
    } catch (error) {
      Alert.alert("Error", error.message, [{ text: "OK" }], {
        cancelable: false,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.row}>
        <View style={styles.inputContainer}>
          <StoreInput
            icon="circle"
            storeName={startStore.storeName}
            setStoreName={startStore.setStoreName}
            error={startStore.storeError}
            placeholder="Enter starting point"
          />
          <Entypo
            name="dots-three-vertical"
            size={24}
            color="black"
            style={styles.iconStyle}
          />
          <StoreInput
            icon="map-pin"
            storeName={endStore.storeName}
            setStoreName={endStore.setStoreName}
            placeholder="Enter destination"
          />
        </View>
        {isLoading ? (
          <View>
            <ActivityIndicator size="large" color="#5500dc" />
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
      {currentMall ? (
        <>
          <View style={styles.mapContainer}>
            <Floorplan
              currentMall={currentMall}
              currentLevel={currentLevel}
              stores={stores}
              path={path}
              graph={graph}
            />
          </View>
          <LevelButtons
            currentMall={currentMall}
            currentLevel={currentLevel}
            setCurrentLevel={setCurrentLevel}
          />
        </>
      ) : (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#5500dc" />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaView: { flex: 1 },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flex: 0.15,
    zIndex: 1,
  },
  inputContainer: {
    alignItems: "center",
    flex: 0.8,
  },
  iconStyle: {
    marginVertical: 10,
  },
  mapContainer: {
    flex: 0.85,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
