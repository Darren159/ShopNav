import { httpsCallable } from "firebase/functions";
import * as FileSystem from "expo-file-system";
import { functions } from "../../firebaseConfig";

// Function to upload SVG data for a specific mall
// Parameters: currentMall - the mall for which the SVG data is being uploaded
//             svgUri - the URI where the SVG data is stored
//             filename - name of the SVG file being uploaded
export default async function uploadSvg(currentMall, svgUri, filename) {
  let svgString;
  try {

     // Attempt to read the SVG file as a string
    svgString = await FileSystem.readAsStringAsync(svgUri);
  } catch (error) {
    throw new Error("Failed to read file. Please try again.");
  }

  // Define the Cloud Function for uploading SVG data
  const uploadSVGData = httpsCallable(functions, "uploadSVGData");

  // Call the Cloud Function with the SVG string and the mall name
  const svgResponse = await uploadSVGData({
    svg: svgString,
    mall: currentMall,
  });

  // Check the response from the Cloud Function. If unsuccessful, throw an error
  if (!svgResponse.data.success) {
    throw new Error(
      "Failed to Upload SVG Data. Please check that you have the correct file."
    );
  }

  // Define the Cloud Function for uploading mall layout
  const uploadMallLayout = httpsCallable(functions, "uploadMallLayout");

  // Call the Cloud Function with the SVG string, the mall name, and the filename
  const layoutResponse = await uploadMallLayout({
    svg: svgString,
    mall: currentMall,
    filename,
  });

  // Check the response from the Cloud Function. If unsuccessful, throw an error
  if (!layoutResponse.data.success) {
    throw new Error(
      "Failed to Upload Mall Layout. Please check that you have the correct file"
    );
  }
}
