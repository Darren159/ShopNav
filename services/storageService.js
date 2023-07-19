import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { storage } from "../firebaseConfig";

export async function fetchSvgUrl(currentMall, currentLevel) {
  const svgPath = `${currentMall}/${currentLevel}.svg`;
  const url = await getDownloadURL(ref(storage, svgPath));
  return url;
}

export async function uploadMallLayout(currentMall, file, filename) {
  const filePath = `review/${currentMall}/${filename}`;
  const storageRef = ref(storage, filePath);
  await uploadString(storageRef, file, "base64");
}
