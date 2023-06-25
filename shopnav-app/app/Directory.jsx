import { useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Floorplan from "../Components/Floorplan";
import MallPicker from "../Components/MallPicker";
import LevelButtons from "../Components/LevelButtons";

export default function Directory() {
  const [currentMall, setCurrentMall] = useState(null);
  const [currentLevel, setCurrentLevel] = useState(1);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{ flex: 0.1, flexDirection: "row", justifyContent: "center" }}
      >
        <MallPicker currentMall={currentMall} setCurrentMall={setCurrentMall} />
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
