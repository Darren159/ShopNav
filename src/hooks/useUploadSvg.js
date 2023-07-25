// useUploadSvg.js
import { httpsCallable } from "firebase/functions";
import * as FileSystem from "expo-file-system";
import { functions } from "../../firebaseConfig";

export default function useUploadSvg(currentMall, svgUri, filename) {
  const uploadSvg = async () => {
    const svgString = await FileSystem.readAsStringAsync(svgUri);

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
  };
  return uploadSvg;
}
