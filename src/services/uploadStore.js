import { httpsCallable } from "firebase/functions";
import { functions } from "../../firebaseConfig";

export default async function uploadStore(currentMall, storeDocId, promoInfo) {
  const uploadStoreData = httpsCallable(functions, "uploadStoreData");
  const storeResponse = await uploadStoreData({
    mall: currentMall,
    store: storeDocId,
    promo: promoInfo,
  });
  if (!storeResponse.data.success) {
    throw new Error(
      "Failed to Upload Store Data. Please check your internet connection"
    );
  }
}
