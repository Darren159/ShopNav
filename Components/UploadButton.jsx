import { Button } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import PropTypes from "prop-types";
import * as FileSystem from "expo-file-system";
import { getFunctions, httpsCallable } from "firebase/functions";
import { uploadSVGData } from "../services/databaseService";

export default function UploadButton({ currentMall }) {
  const uploadSvg = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "image/svg+xml",
      copyToCacheDirectory: false,
    });
    if (result.type !== "cancel") {
      const newUri = FileSystem.documentDirectory + result.uri.split("/").pop();

      await FileSystem.copyAsync({
        from: result.uri,
        to: newUri,
      });

      const svgString = await FileSystem.readAsStringAsync(newUri);

      const functions = getFunctions();
      const parseSVGData = httpsCallable(functions, "parseSVGData");
      const {
        data: { nodeData, storeData },
      } = await parseSVGData({ svg: svgString });

      uploadSVGData(currentMall, nodeData, storeData);
    }
  };

  return <Button title="Upload SVG" onPress={uploadSvg} />;
}

UploadButton.propTypes = {
  currentMall: PropTypes.string.isRequired,
};
