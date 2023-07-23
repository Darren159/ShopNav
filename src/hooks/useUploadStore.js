import { httpsCallable } from "firebase/functions";
import { functions } from "../../firebaseConfig";
import getStore from "../services/getStore";

export default function useUploadStore(
  currentMall,
  storeName,
  setStoreError,
  promoInfo
) {
  const uploadStore = async () => {
    // Clear the previous errors
    setStoreError(false);

    try {
      const storeDocId = await getStore(currentMall, storeName);
      const uploadStoreData = httpsCallable(functions, "uploadStoreData");
      await uploadStoreData({
        mall: currentMall,
        store: storeDocId,
        promo: promoInfo,
      });
    } catch (error) {
      setStoreError(true);
    }
  };

  return uploadStore;
}
