import { useState, useContext } from "react";
import { Stack, router } from "expo-router";
import { Button, View, StyleSheet, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "../context/auth";
import MallPicker from "../../components/MallPicker";
import { MallContext } from "../context/mallProvider";
import StoreInput from "../../components/StoreInput";
import UploadButton from "../../components/UploadButton";
import useUploadSvg from "../../hooks/useUploadSvg";
import useUploadStore from "../../hooks/useUploadStore";

export default function DeveloperAccess() {
  const { malls, currentMall, setCurrentMall } = useContext(MallContext);
  const [storeName, setStoreName] = useState("");
  const [storeError, setStoreError] = useState(false);
  const [promoInfo, setPromoInfo] = useState("");
  const { signout } = useContext(AuthContext);
  const uploadSvg = useUploadSvg(currentMall);
  const uploadStore = useUploadStore(
    currentMall,
    storeName,
    setStoreError,
    promoInfo
  );

  const handleSignOut = async () => {
    await signout();
    router.replace("/sign-in");
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: null,
        }}
      />
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
            <UploadButton title="Upload SVG" onPress={uploadSvg} />
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
            <UploadButton title="Upload Store Info" onPress={uploadStore} />
          </>
        )}
        <Button title="Sign Out" onPress={handleSignOut} />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeAreaView: { flex: 1 },
});
