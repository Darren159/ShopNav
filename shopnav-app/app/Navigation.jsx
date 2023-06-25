import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useState } from "react";
import { Button, TextInput, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Floorplan from "../Components/Floorplan";
import MallPicker from "../Components/MallPicker";
import LevelButtons from "../Components/LevelButtons";

export default function Navigation() {
  const [currentMall, setCurrentMall] = useState(null);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [startStoreName, setStartStoreName] = useState("");
  const [endStoreName, setEndStoreName] = useState("");
  const [startStoreError, setStartStoreError] = useState(false);
  const [endStoreError, setEndStoreError] = useState(false);

  async function getNodeIDFromStoreName(
    mallName,
    storeName,
    isStartStore = true
  ) {
    const formattedStoreName = storeName.replace(/\s/g, "-").toLowerCase();
    const documentID = `${mallName.toLowerCase()}-${formattedStoreName}-node`;
    const docRef = doc(db, mallName, documentID);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      return true;
    } else {
      // Mark the corresponding TextInput as error
      isStartStore ? setStartStoreError(true) : setEndStoreError(true);
      return false;
    }
  }

  const handleClick = async () => {
    // Clear the previous errors
    setStartStoreError(false);
    setEndStoreError(false);

    const startStoreExists = await getNodeIDFromStoreName(
      mallName,
      startStoreName,
      true
    );
    const endStoreExists = await getNodeIDFromStoreName(
      mallName,
      endStoreName,
      false
    );
    if (startStoreExists && endStoreExists) {
      console.log("Start and End stores exist");
      // Continue processing...
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          flex: 0.1,
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <MallPicker currentMall={currentMall} setCurrentMall={setCurrentMall} />
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              width: 250,
            }}
          >
            <TextInput
              onChangeText={setStartStoreName}
              value={startStoreName}
              placeholder="Enter start store"
              style={{
                height: 50,
                width: 150,
                borderColor: startStoreError ? "red" : "#000",
                borderWidth: 1,
              }}
            />
            <Text style={{ color: "red" }}>
              {startStoreError ? "Invalid start store" : " "}
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              width: 250,
            }}
          >
            <TextInput
              onChangeText={setEndStoreName}
              value={endStoreName}
              placeholder="Enter end store"
              style={{
                height: 50,
                width: 150,
                borderColor: endStoreError ? "red" : "#000",
                borderWidth: 1,
              }}
            />
            <Text style={{ color: "red" }}>
              {endStoreError ? "Invalid end store" : " "}
            </Text>
          </View>
        </View>

        <View style={{ width: 150 }}>
          <Button title="Get Directions" onPress={handleClick} />
        </View>
      </View>
      {currentMall && (
        <>
          <Floorplan mallName={currentMall} currentLevel={currentLevel} />
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
