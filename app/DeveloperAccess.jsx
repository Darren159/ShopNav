import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import UploadButton from "../Components/UploadButton";
import MallPicker from "../Components/MallPicker";
import { useMalls } from "../services/databaseService";

export default function DeveloperAccess() {
  const { malls, currentMall, setCurrentMall } = useMalls();

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
          <UploadButton currentMall={currentMall} />
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaView: { flex: 1 },
  mapContainer: {
    flex: 0.8,
  },
});
