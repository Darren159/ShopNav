import { useState } from "react";
import { View, StyleSheet, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import UploadSVGButton from "../components/UploadSVGButton";
import UploadStoreButton from "../components/UploadStoreButton";
import MallPicker from "../components/MallPicker";
import useMalls from "../hooks/useMalls";
import StoreInput from "../components/StoreInput";

export default function DeveloperAccess() {
  const { malls, currentMall, setCurrentMall } = useMalls();
  const [storeName, setStoreName] = useState("");
  const [storeError, setStoreError] = useState(false);
  const [promoInfo, setPromoInfo] = useState("");

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
          <UploadSVGButton currentMall={currentMall} />
          <StoreInput
            storeName={storeName}
            setStoreName={setStoreName}
            error={storeError}
            placeholder="Enter store"
          />
          <TextInput
            onChangeText={setPromoInfo}
            value={promoInfo}
            placeholder="Input Promo Info"
            style={{
              height: 50,
              width: 150,
              borderWidth: 1,
            }}
          />
          <UploadStoreButton
            currentMall={currentMall}
            storeName={storeName}
            setStoreError={setStoreError}
            promoInfo={promoInfo}
          />
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
