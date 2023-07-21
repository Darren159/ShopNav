import { Button } from "react-native";
import PropTypes from "prop-types";
import { httpsCallable } from "firebase/functions";
import { functions } from "../../firebaseConfig";
import getStore from "../services/getStore";

export default function UploadStoreButton({
  currentMall,
  storeName,
  setStoreError,
  promoInfo,
}) {
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

  return <Button title="Upload Store Info" onPress={uploadStore} />;
}

UploadStoreButton.propTypes = {
  currentMall: PropTypes.string.isRequired,
  storeName: PropTypes.string.isRequired,
  setStoreError: PropTypes.func.isRequired,
  promoInfo: PropTypes.string.isRequired,
};
