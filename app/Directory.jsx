import { useState, useContext } from "react";
import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";
import useStoreList from "../hooks/useStoreList";
import Floorplan from "../components/Floorplan";
import MallPicker from "../components/MallPicker";
import { MallContext } from "../context/MallProvider";
import LevelButtons from "../components/LevelButtons";

export default function Directory() {
  const { malls, currentMall, setCurrentMall } = useContext(MallContext);
  const { stores } = useStoreList(currentMall);
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
          <View style={styles.mapContainer}>
            <Floorplan currentMall={currentMall} currentLevel={currentLevel}>
              <Svg
                style={styles.overlayStores}
                height="100%"
                width="100%"
                viewBox="0 0 760 600"
              >
                {stores
                  .filter((store) => store.level === currentLevel)
                  .map((store) => (
                    <Path
                      d={store.coordinates}
                      fill="none"
                      stroke="transparent"
                      strokeWidth="1"
                      key={store.id}
                      onPress={() => console.log("Store clicked:", store.id)}
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
  mallPickerContainer: {
    flex: 0.1,
    flexDirection: "row",
    justifyContent: "center",
  },
  mapContainer: {
    flex: 0.8,
  },
  overlayStores: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
