import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../../firebaseConfig";

// Function to fetch SVG URL for a specific level of a specific mall
// Parameters: currentMall - the mall for which the SVG is being fetched
//             currentLevel - the level of the mall for which the SVG is being fetched
export default async function fetchSvgUrl(currentMall, currentLevel) {

  // Define the path of the SVG in Firebase storage
  const svgPath = `${currentMall}/${currentLevel}.svg`;

  // Fetch the download URL for the SVG from Firebase storage
  const url = await getDownloadURL(ref(storage, svgPath));

  // If the URL is found, return it
  if (url) {
    return url;
  }
  // If the URL is not found, throw an error
  throw new Error();
}
