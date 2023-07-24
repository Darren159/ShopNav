import { httpsCallable } from "firebase/functions";
import { functions } from "../../firebaseConfig";

export default function useUploadStore(currentMall, storeName, promoInfo) {
  const uploadStore = async (storeDocId) => {
    const uploadStoreData = httpsCallable(functions, "uploadStoreData");
    const storeResponse = await uploadStoreData({
      mall: currentMall,
      store: storeDocId,
      promo: promoInfo,
    });
    if (!storeResponse.data.success) {
      throw new Error(storeResponse.data.message);
    }
  };

  return uploadStore;
}
