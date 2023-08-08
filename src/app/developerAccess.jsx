import { useState, useContext } from "react";
import { View, StyleSheet, Text, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as DocumentPicker from "expo-document-picker";
import { MallContext } from "./context/mallProvider";
import StoreInput from "../components/StoreInput";
import UploadButton from "../components/UploadButton";
import uploadSvg from "../services/uploadSvg";
import SelectFile from "../components/SelectFile";
import uploadStore from "../services/uploadStore";
import fetchStoreId from "../services/fetchStoreId";

// The DeveloperAccess function component provides a user interface and functionality
// for developers to upload promotion information and SVG images related to specific stores.
export default function DeveloperAccess() {
  const { currentMall } = useContext(MallContext);
  const [promoInfo, setPromoInfo] = useState("");
  const [storeName, setStoreName] = useState("");
  const [filename, setFilename] = useState("");
  const [svgUri, setSvgUri] = useState("");

  // Async function to select a file from the user's device.
  const selectFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      // Only SVG images are allowed.
      type: "image/svg+xml",

      // Copies the selected file to cache directory.
      copyToCacheDirectory: true,
    });
    if (result.type !== "cancel") {
      // Set the filename state to the selected file's name.
      setFilename(result.assets[0].name);

      // Set the SVG URI state to the selected file's URI.
      setSvgUri(result.assets[0].uri);
    }
  };

  // Async function to upload the store and its related promotion information.
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
            <View style={styles.inputContainer}>
              <View style={{ marginBottom: 5 }}>
                <StoreInput
                  storeName={storeName}
                  setStoreName={setStoreName}
                  placeholder="Enter Store"
                  zIndex={1}
                />
              </View>
              <TextInput
                onChangeText={setPromoInfo}
                value={promoInfo}
                placeholder="Input Promo Info"
                style={styles.textInput}
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
  textInput: {
    paddingVertical: 5,
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 10,
    backgroundColor: "#fff",
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
