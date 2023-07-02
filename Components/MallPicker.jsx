import { View } from "react-native";
import { useState, useEffect } from "react";
import { Picker } from "@react-native-picker/picker";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";

export default function MallPicker({ currentMall, setCurrentMall }) {
  const [malls, setMalls] = useState([]);

  useEffect(() => {
    const fetchMalls = async () => {
      const mallCollection = collection(db, "malls");
      const mallSnapshot = await getDocs(mallCollection);
      const mallList = mallSnapshot.docs.map((doc) => doc.id);
      setMalls(mallList);
      setCurrentMall(mallList[0]); // Set the first mall as the current mall
    };
    fetchMalls();
  }, []);
  return (
    <View style={{ height: 50, width: 150 }}>
      <Picker
        selectedValue={currentMall}
        onValueChange={(value) => setCurrentMall(value)}
      >
        {malls.map((mall, index) => (
          <Picker.Item key={index} label={mall} value={mall} />
        ))}
      </Picker>
    </View>
  );
}
