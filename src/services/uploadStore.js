import { httpsCallable } from "firebase/functions";
import { functions } from "../../firebaseConfig";

// Function to upload store data for a specific mall
// Parameters: currentMall - the mall for which the store data is being uploaded
//             storeDocId - the document id of the store in the Firestore database
//             promoInfo - information about promotions in the store
export default async function uploadStore(currentMall, storeDocId, promoInfo) {

  // Define the Cloud Function for uploading store data
  const uploadStoreData = httpsCallable(functions, "uploadStoreData");

  // Call the Cloud Function with the mall name, store document id, and promo information
  const storeResponse = await uploadStoreData({
    mall: currentMall,
    store: storeDocId,
    promo: promoInfo,
  });

  // Check the response from the Cloud Function. If unsuccessful, throw an error
  if (!storeResponse.data.success) {
    throw new Error(
      "Failed to Upload Store Data. Please check your internet connection"
    );
  }
}
