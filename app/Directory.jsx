import { useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMalls } from "../services/databaseService";
import Floorplan from "../Components/Floorplan";
import MallPicker from "../Components/MallPicker";
import LevelButtons from "../Components/LevelButtons";

export default function Directory() {
  const { malls, currentMall, setCurrentMall } = useMalls();
  const [currentLevel, setCurrentLevel] = useState(1);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{ flex: 0.1, flexDirection: "row", justifyContent: "center" }}
      >
        {currentMall && (
          <MallPicker
            currentMall={currentMall}
            setCurrentMall={setCurrentMall}
            malls={malls}
          />
        )}
      </View>
      {currentMall && (
        <Floorplan currentMall={currentMall} currentLevel={currentLevel} />
      )}
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
