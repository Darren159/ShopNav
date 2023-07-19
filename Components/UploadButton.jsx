import { Button } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import PropTypes from "prop-types";
import * as FileSystem from "expo-file-system";
import { httpsCallable } from "firebase/functions";
import { functions } from "../firebaseConfig";

export default function UploadButton({ currentMall }) {
  const uploadSvg = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "image/svg+xml",
      copyToCacheDirectory: false,
    });
    if (result.type !== "cancel") {
      const filename = result.name;
      const newUri = FileSystem.documentDirectory + result.uri.split("/").pop();

      await FileSystem.copyAsync({
        from: result.uri,
        to: newUri,
      });

      const svgString = await FileSystem.readAsStringAsync(newUri);
      const svgBase64 = await FileSystem.readAsStringAsync(newUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const uploadSVGData = httpsCallable(functions, "uploadSVGData");
      await uploadSVGData({ svg: svgString, mall: currentMall });

      const uploadMallLayout = httpsCallable(functions, "uploadMallLayout");
      await uploadMallLayout({
        svg: svgBase64,
        mall: currentMall,
        filename,
      });
    }
  };

  return <Button title="Upload SVG" onPress={uploadSvg} />;
}

UploadButton.propTypes = {
  currentMall: PropTypes.string.isRequired,
};
