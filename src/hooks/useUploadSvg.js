// useUploadSvg.js
import { httpsCallable } from "firebase/functions";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { functions } from "../../firebaseConfig";

export default function useUploadSvg(currentMall) {
  const uploadSvg = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "image/svg+xml",
      copyToCacheDirectory: true,
    });

    if (result.type !== "cancel") {
      const filename = result.assets[0].name;
      const svguri = result.assets[0].uri;
      const svgString = await FileSystem.readAsStringAsync(svguri);
      const uploadSVGData = httpsCallable(functions, "uploadSVGData");
      await uploadSVGData({ svg: svgString, mall: currentMall });
      const uploadMallLayout = httpsCallable(functions, "uploadMallLayout");
      await uploadMallLayout({
        svg: svgString,
        mall: currentMall,
        filename,
      });
    }
  };

  return uploadSvg;
}
