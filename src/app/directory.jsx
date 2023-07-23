import { useState, useEffect, useContext, useRef } from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
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
  const [isLoading, setIsLoading] = useState(false);
  const [isButtonPressed, setButtonPressed] = useState(false);

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
    setButtonPressed(true);
    const startNodeId = `${await startStore.handleClick(fetchStore)}-node`;
    const endNodeId = `${await endStore.handleClick(fetchStore)}-node`;

    if (startNodeId && endNodeId) {
      const shortestPath = dijkstra(graph, startNodeId, endNodeId);
      setPath(shortestPath !== null ? shortestPath : []);
    }

    setIsLoading(false);
  };

  // handle wrong input error
  const startError = useRef(startStore.storeError);
  const endError = useRef(endStore.storeError);

  useEffect(() => {
    startError.current = startStore.storeError;
    endError.current = endStore.storeError;
  }, [startStore.storeError, endStore.storeError]);

  useEffect(() => {
    if ((isButtonPressed && startError.current) || endError.current) {
      Alert.alert(
        "Invalid Store Input",
        "Try re-typing the store inputs, make sure that there are no symbols used, and double check your spacings",
        [
          {
            text: "OK",
            onPress: () => {
              // console.log(" ok, close storeInput error ");
              setButtonPressed(false);
            },
          },
        ]
      );
    }
  }, [isButtonPressed]);
  // for navigation to storeSearch

  const handleStoreSearch = () => {
    router.push({ pathname: "/storeSearch" });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#5500dc" />
        </View>
      )}
      {currentMall && (
        <>
          <View
            style={{ flex: 0.05, width: 150, borderWidth: 1, marginLeft: 10 }}
          >
            <MallPicker
              currentMall={currentMall}
              setCurrentMall={setCurrentMall}
              malls={malls}
            />
          </View>

          <View style={{ flex: 0.08, flexDirection: "row", marginTop: 5 }}>
            <View
              style={{
                flex: 0.1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                style={{ height: 30, width: 30 }}
                source={{
                  uri: "https://th.bing.com/th/id/OIP.beeEDyY2Mzow-Gd3ZlwAdAHaHa?w=189&h=189&c=7&r=0&o=5&pid=1.7",
                }}
              />
            </View>
            <View
              style={{
                flex: 0.8,
                width: 270,
                borderWidth: 1,
                borderRadius: 10,
                justifyContent: "center",
              }}
            >
              <StoreInput
                storeName={startStore.storeName}
                setStoreName={startStore.setStoreName}
                error={startStore.storeError}
                placeholder="Enter starting point"
              />
            </View>
            <View
              style={{
                flex: 0.1,
                backgroundColor: "white",
                alignItems: "center",
                justifyContent: "center",
                padding: 5,
              }}
            >
              <TouchableOpacity
                onPress={handleStoreSearch}
                color="black"
                style={{ justifyContent: "center", alignItems: "center" }}
              >
                <Image
                  style={{ height: 30, width: 30 }}
                  source={{
                    uri: "https://th.bing.com/th/id/OIP.lL3Tke2NpekjvyzN7R9ALwAAAA?pid=ImgDet&w=196&h=196&c=7",
                  }}
                />
                <Text style={{ fontSize: 5 }}>StoreSearch</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ flex: 0.025, flexDirection: "row" }}>
            <View
              style={{
                flex: 0.1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                style={{ height: 20, width: 20 }}
                source={{ uri: "https://i.stack.imgur.com/k59em.png" }}
              />
            </View>
            <View style={{ flex: 0.9 }}>
              <Text> </Text>
            </View>
          </View>

          <View style={{ flex: 0.08, flexDirection: "row" }}>
            <View
              style={{
                flex: 0.1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                style={{ height: 30, width: 30 }}
                source={{
                  uri: "https://conjunctconsulting.org/wp-content/uploads/2017/02/Place-Icon.png",
                }}
              />
            </View>

            <View
              style={{
                flex: 0.8,
                width: 270,
                borderWidth: 1,
                borderRadius: 10,
                justifyContent: "center",
              }}
            >
              <StoreInput
                storeName={endStore.storeName}
                setStoreName={endStore.setStoreName}
                error={endStore.storeError}
                placeholder="Enter destination"
              />
            </View>

            <View
              style={{
                flex: 0.1,
                height: 55,
                width: 55,
                backgroundColor: "white",
                justifyContent: "center",
                alignItems: "center",
                padding: 5,
              }}
            >
              <TouchableOpacity onPress={calculatePath} color="black">
                <Image
                  style={{ height: 40, width: 40 }}
                  source={{
                    uri: "https://th.bing.com/th/id/R.adb1e7f0422d05a53e5844dd0aa3648b?rik=ci7tAX%2buprqGQQ&riu=http%3a%2f%2fcdn.onlinewebfonts.com%2fsvg%2fimg_416750.png&ehk=MJrZ8noxdKUB%2b4V9CZBO%2bZwfEpLYUdgrL0rjR8Zb2a0%3d&risl=&pid=ImgRaw&r=0",
                  }}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ flex: 0.7 }}>
            <Floorplan currentMall={currentMall} currentLevel={currentLevel}>
              <Svg style={{}} height="100%" width="100%" viewBox="0 0 760 600">
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
  safeAreaContainer: {
    flex: 1,
    backgroundColor: "white",
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
