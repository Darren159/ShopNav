import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../firebaseConfig";

export default async function fetchSvgUrl(currentMall, currentLevel) {
  const svgPath = `${currentMall}/${currentLevel}.svg`;
  const url = await getDownloadURL(ref(storage, svgPath));
  return url;
}
