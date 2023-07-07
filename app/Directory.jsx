import { useState } from "react";
import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMalls } from "../services/databaseService";
import Floorplan from "../Components/Floorplan";
import MallPicker from "../Components/MallPicker";
import LevelButtons from "../Components/LevelButtons";

export default function Directory() {
  const { malls, currentMall, setCurrentMall } = useMalls();
  const [currentLevel, setCurrentLevel] = useState(1);
  return (
    <SafeAreaView style={styles.safeAreaView}>
      {currentMall && (
        <>
          <View style={styles.mallPickerContainer}>
            <MallPicker
              currentMall={currentMall}
              setCurrentMall={setCurrentMall}
              malls={malls}
            />
          </View>
          <Floorplan currentMall={currentMall} currentLevel={currentLevel} />
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
  mallPickerContainer: {
    flex: 0.1,
    flexDirection: "row",
    justifyContent: "center",
  },
});
