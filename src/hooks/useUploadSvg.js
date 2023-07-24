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
      const svgResponse = await uploadSVGData({
        svg: svgString,
        mall: currentMall,
      });
      if (!svgResponse.data.success) {
        throw new Error(svgResponse.data.message);
      }

      const uploadMallLayout = httpsCallable(functions, "uploadMallLayout");
      const layoutResponse = await uploadMallLayout({
        svg: svgString,
        mall: currentMall,
        filename,
      });
      if (!layoutResponse.data.success) {
        throw new Error(layoutResponse.data.message);
      }
    }
  };
  return uploadSvg;
}
