import { useState, useEffect, useContext } from "react";
import { View, StyleSheet, Image, Text, TouchableOpacity, ActivityIndicator } from "react-native";
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
import { MallContext } from "../context/MallProvider";
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
  const [error, setError] = useState(null);


  useEffect(() => {
    try {
      if (currentMall) {
        setIsLoading(true);
        getGraph(currentMall).then((nodes) => setGraph(nodes));
        setIsLoading(false);
      }
      
    } catch (err) {
      setError(err);
      setIsLoading(false);

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

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#5500dc" />
      </View>
    );
  }

  // error interface
  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>
          Error in fetching data ... Please check your internet connection!
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      {currentMall && (
        <>
          <View style={{ flexDirection:'row' , flex: 0.3}}>
            <View style ={{flex:0.1 , paddingTop:75 , paddingLeft:20}}>
              <Image
                style ={{ height:30, width:30}}
                source={{ uri: "https://th.bing.com/th/id/OIP.beeEDyY2Mzow-Gd3ZlwAdAHaHa?w=189&h=189&c=7&r=0&o=5&pid=1.7"}}
              />
              <Image
                style ={{ height:40, width:30 }}
                source={{ uri: "https://i.stack.imgur.com/k59em.png"}}
              />
              <Image
                style ={{ height:30, width:30 }}
                source={{ uri: "https://conjunctconsulting.org/wp-content/uploads/2017/02/Place-Icon.png"}}
              />
            </View>
            <View style={{flexDirection: 'column', flex: 0.8 , alignItems: 'center'}}>

              <View style = {{ flex:0.3 , width:150 , padding:3, marginBottom:10, borderWidth:1}}>
                <MallPicker
                  currentMall={currentMall}
                  setCurrentMall={setCurrentMall}
                  malls={malls}
                />
              </View>

              <View style = {{ flex:0.3 , width: 270 , borderWidth: 1, borderRadius:10, justifyContent: 'center', padding:3 , marginBottom:15}}>
              
                <StoreInput
                  storeName={startStore.storeName}
                  setStoreName={startStore.setStoreName}
                  error={startStore.storeError}
                  placeholder="Enter starting point"
                />
              </View>

              <View style = {{ flex:0.3, width: 270, borderWidth: 1, borderRadius:10 , justifyContent: 'center', padding:3, marginBottom:5}}>
                <StoreInput
                  storeName={endStore.storeName}
                  setStoreName={endStore.setStoreName}
                  error={endStore.storeError}
                  placeholder="Enter destination"
                />
              </View>


            </View>

            <View style= {{flex:0.1, marginRight:25}}>
              <View style={{ borderWidth:1, backgroundColor: 'white', alignItems:'center', justifyContent: 'center', width:55, height: 55 ,borderRadius:10 , marginRight:10, marginTop:64}}>
                
                  <Link 
                    href={{
                        pathname: "/storeSearch",
                        
                    }}
                    >
                    
                      <Image 
                        style = {{height:30, width:30}}
                        source={{ uri: "https://th.bing.com/th/id/OIP.lL3Tke2NpekjvyzN7R9ALwAAAA?pid=ImgDet&w=196&h=196&c=7"}} 
                      />
                      <Text style ={{fontSize:5}}>StoreSearch</Text>

                    
                    </Link>
                  
              </View>

              <View style = {{ height:55, width:55, backgroundColor: "white" , marginTop:17, justifyContent:'center', alignItems:'center'}}>
                    <TouchableOpacity onPress={calculatePath} color= 'black' >
                      <Image
                        style = {{ height:50, width:50}}
                        source={{uri:'https://th.bing.com/th/id/R.adb1e7f0422d05a53e5844dd0aa3648b?rik=ci7tAX%2buprqGQQ&riu=http%3a%2f%2fcdn.onlinewebfonts.com%2fsvg%2fimg_416750.png&ehk=MJrZ8noxdKUB%2b4V9CZBO%2bZwfEpLYUdgrL0rjR8Zb2a0%3d&risl=&pid=ImgRaw&r=0'}}
                      />
                    </TouchableOpacity>
              </View>
            </View>
          </View>


          <View style={{flex:0.7, marginBottom: 100}}>
            <Floorplan currentMall={currentMall} currentLevel={currentLevel}>
              <Svg
                style={{}}
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
  safeAreaContainer: { 
    flex:1 , 
    marginTop:-50 ,
    backgroundColor:'white' 
  }
});
