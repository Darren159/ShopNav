import { useState, useContext } from "react";
import { View, StyleSheet, TextInput, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as DocumentPicker from "expo-document-picker";
import { MallContext } from "../context/mallProvider";
import StoreInput from "../../components/StoreInput";
import UploadButton from "../../components/UploadButton";
import uploadSvg from "../../services/uploadSvg";
import SelectFile from "../../components/SelectFile";
import uploadStore from "../../services/uploadStore";
import fetchStoreId from "../../services/fetchStoreId";

export default function DeveloperAccess() {
  const { currentMall } = useContext(MallContext);
  const [promoInfo, setPromoInfo] = useState("");
  const [storeName, setStoreName] = useState("");
  const [filename, setFilename] = useState("");
  const [svgUri, setSvgUri] = useState("");

  const selectFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "image/svg+xml",
      copyToCacheDirectory: true,
    });
    if (result.type !== "cancel") {
      setFilename(result.assets[0].name);
      setSvgUri(result.assets[0].uri);
    }
  };

  const handleUploadStore = async () => {
    // Fetch the store
    const storeDocId = await fetchStoreId(currentMall, storeName);

    // If store exists, upload the store info
    await uploadStore(currentMall, storeDocId, promoInfo);
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
              <SelectFile title="Select SVG" onPress={selectFile} />
            </View>
            <View style={styles.button}>
              <UploadButton
                title="Upload SVG"
                onPress={() => uploadSvg(currentMall, svgUri, filename)}
              />
            </View>
          </View>
          <View style={styles.container}>
            <Text style={styles.title}>Store Info</Text>
            <View style={{ padding: 10 }}>
              <StoreInput
                storeName={storeName}
                setStoreName={setStoreName}
                placeholder="Enter Store"
              />
            </View>

            <TextInput
              onChangeText={setPromoInfo}
              value={promoInfo}
              placeholder="Input Promo Info"
              style={styles.promoInput}
            />

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
  button: { alignItems: "center" },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  promoInput: {
    borderWidth: 1,
    borderRadius: 10,
    textAlign: "left",
    marginHorizontal: 10,
    paddingVertical: 3,
    paddingLeft: 10,
    backgroundColor: "#fff",
  },
});
