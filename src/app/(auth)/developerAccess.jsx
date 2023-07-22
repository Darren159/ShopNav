import { useState, useContext } from "react";
import { Stack, router } from "expo-router";
import { Button, View, StyleSheet, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "../context/auth";
import UploadSVGButton from "../../components/UploadSVGButton";
import UploadStoreButton from "../../components/UploadStoreButton";
import MallPicker from "../../components/MallPicker";
import { MallContext } from "../context/mallProvider";
import StoreInput from "../../components/StoreInput";

export default function DeveloperAccess() {
  const { malls, currentMall, setCurrentMall } = useContext(MallContext);
  const [storeName, setStoreName] = useState("");
  const [storeError, setStoreError] = useState(false);
  const [promoInfo, setPromoInfo] = useState("");
  const { signout } = useContext(AuthContext);

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
        <Button title="Sign Out" onPress={handleSignOut} />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeAreaView: { flex: 1 },
  mapContainer: {
    flex: 0.8,
  },
});
