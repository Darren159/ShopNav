import * as DocumentPicker from "expo-document-picker";
import { useState } from "react";

export default function useSelectFile() {
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
  return { selectFile, svgUri, filename };
}
