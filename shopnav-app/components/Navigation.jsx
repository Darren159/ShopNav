import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Button, TextInput } from "react-native-paper";
import FloorPlan from "./FloorPlan";
import db from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

export default function Navigation() {
  const [store1, setStore1] = useState("");
  const [store2, setStore2] = useState("");
  const [coords1, setCoords1] = useState(null);
  const [coords2, setCoords2] = useState(null);

  const fetchStoreCoords = async (storeName, setCoordsFunc) => {
    try {
      const docRef = doc(db, "stores", storeName);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        setCoordsFunc(docSnap.data());
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error getting document:", error);
    }
  };

  const handleSubmit = async () => {
    await Promise.all([
      fetchStoreCoords(store1, setCoords1),
      fetchStoreCoords(store2, setCoords2),
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          label="Enter first store name"
          value={store1}
          onChangeText={setStore1}
        />
        <TextInput
          label="Enter second store name"
          value={store2}
          onChangeText={setStore2}
        />
        <Button onPress={handleSubmit}>Find Route</Button>
      </View>
      <View style={styles.mapContainer}>
        <FloorPlan coords1={coords1} coords2={coords2} />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  inputContainer: {
    padding: 10,
  },
  mapContainer: {
    flex: 2,
    justifyContent: "flex-start",
    alignItems: "center",
  },
});
