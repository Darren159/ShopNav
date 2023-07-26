import { useState, useContext } from "react";
import { View, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MallContext } from "../context/mallProvider";
import StoreInput from "../../components/StoreInput";
import UploadButton from "../../components/UploadButton";
import useStoreInput from "../../hooks/useStoreInput";
import useUploadSvg from "../../hooks/useUploadSvg";
import useUploadStore from "../../hooks/useUploadStore";
import useSelectFile from "../../hooks/useSelectFile";
import SelectButton from "../../components/SelectButton";

export default function DeveloperAccess() {
  const { currentMall } = useContext(MallContext);
  const { storeName, setStoreName, handleStore } = useStoreInput(currentMall);
  const [promoInfo, setPromoInfo] = useState("");
  const { selectFile, svgUri, filename } = useSelectFile(currentMall);
  const uploadSvg = useUploadSvg(currentMall, svgUri, filename);
  const uploadStore = useUploadStore(currentMall, promoInfo);

  const handleUploadStore = async () => {
    // Fetch the store
    const storeDocId = await handleStore();

    // If store exists, upload the store info
    await uploadStore(storeDocId);
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      {currentMall && (
        <>
          <View style={styles.container}>
            <Text style={styles.title}>SVG</Text>
            <View style={{ padding: 10 }}>
              <Text>{filename ? `Selected file: ${filename}` : " "}</Text>
            </View>

            <View style={styles.button}>
              <SelectButton title="Select SVG" onPress={selectFile} />
            </View>
            <View style={styles.button}>
              <UploadButton title="Upload SVG" onPress={uploadSvg} />
            </View>
          </View>
          <View style={styles.container}>
            <Text style={styles.title}>Store Info</Text>
            <View style={styles.inputContainer}>
              <View style={{ marginBottom: 5 }}>
                <StoreInput
                  storeName={storeName}
                  setStoreName={setStoreName}
                  placeholder="Enter Store"
                />
              </View>
              <StoreInput
                storeName={promoInfo}
                setStoreName={setPromoInfo}
                placeholder="Input Promo Info"
              />
            </View>

            <View style={styles.button}>
              <UploadButton
                title="Upload Store Info"
                onPress={handleUploadStore}
              />
            </View>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaView: { flex: 1 },
  container: {
    borderColor: "grey",
    borderWidth: 1,
    borderRadius: 5,
    margin: 10,
    padding: 10,
  },
  inputContainer: {
    padding: 10,
  },
  button: { alignItems: "center" },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
