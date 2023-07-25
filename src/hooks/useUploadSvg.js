// useUploadSvg.js
import { httpsCallable } from "firebase/functions";
import * as FileSystem from "expo-file-system";
import { functions } from "../../firebaseConfig";

export default function useUploadSvg(currentMall, svgUri, filename) {
  const uploadSvg = async () => {
    let svgString;
    try {
      svgString = await FileSystem.readAsStringAsync(svgUri);
    } catch (error) {
      throw new Error("Failed to read file. Please try again.");
    }

    const uploadSVGData = httpsCallable(functions, "uploadSVGData");
    const svgResponse = await uploadSVGData({
      svg: svgString,
      mall: currentMall,
    });
    if (!svgResponse.data.success) {
      throw new Error(
        "Failed to Upload SVG Data. Please check that you have the correct file."
      );
    }

    const uploadMallLayout = httpsCallable(functions, "uploadMallLayout");
    const layoutResponse = await uploadMallLayout({
      svg: svgString,
      mall: currentMall,
      filename,
    });
    if (!layoutResponse.data.success) {
      throw new Error(
        "Failed to Upload Mall Layout. Please check that you have the correct file"
      );
    }
  };
  return uploadSvg;
}
