import { useState, useContext } from "react";
import { Stack, router } from "expo-router";
import {
  TouchableOpacity,
  View,
  StyleSheet,
  TextInput,
  Text,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "../context/auth";
import { MallContext } from "../context/mallProvider";
import StoreInput from "../../components/StoreInput";
import UploadButton from "../../components/UploadButton";
import useStoreInput from "../../hooks/useStoreInput";
import useUploadSvg from "../../hooks/useUploadSvg";
import useUploadStore from "../../hooks/useUploadStore";

export default function DeveloperAccess() {
  const { currentMall } = useContext(MallContext);
  const { storeName, setStoreName, handleClick } = useStoreInput(currentMall);
  const [promoInfo, setPromoInfo] = useState("");
  const { signout } = useContext(AuthContext);
  const uploadSvg = useUploadSvg(currentMall);
  const uploadStore = useUploadStore(currentMall, promoInfo);

  const handleUploadStore = async () => {
    // Fetch the store
    const storeDocId = await handleClick();

    // If store exists, upload the store info
    await uploadStore(storeDocId);
  };

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
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <UploadButton title="Upload SVG" onPress={uploadSvg} />
            </View>

            <View style={{ padding: 10 }}>
              <StoreInput
                storeName={storeName}
                setStoreName={setStoreName}
                placeholder="Enter store"
              />
            </View>

            <View style={{ alignItems: "center", padding: 10 }}>
              <TextInput
                onChangeText={setPromoInfo}
                value={promoInfo}
                placeholder="Input Promo Info"
                style={{
                  height: 50,
                  width: 150,
                  borderWidth: 1,
                  borderRadius: 10,
                }}
              />
            </View>

            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <UploadButton
                title="Upload Store Info"
                onPress={handleUploadStore}
              />
            </View>
          </>
        )}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            padding: 10,
          }}
        >
          <TouchableOpacity
            onPress={handleSignOut}
            style={{
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              borderWidth: 1,
              borderRadius: 10,
              backgroundColor: "white",
            }}
          >
            <Image
              style={{ height: 40, width: 40 }}
              source={{
                uri: "https://th.bing.com/th/id/OIP.kEapEfmfmXwTkw5mILXfHQHaHa?w=202&h=202&c=7&r=0&o=5&pid=1.7",
              }}
            />
            <Text> Sign Out </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeAreaView: { flex: 1 },
});
