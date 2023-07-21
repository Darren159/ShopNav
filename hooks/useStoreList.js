import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";

export default function useStoreList(currentMall) {
  const [stores, setStores] = useState([]);

  useEffect(() => {
    const fetchStores = async () => {
      const storeCollection = collection(db, "malls", currentMall, "stores");
      const storeSnapshot = await getDocs(storeCollection);
      const storeList = storeSnapshot.docs.map((storeDoc) => ({
        id: storeDoc.id,
        ...storeDoc.data(),
      }));
      setStores(storeList);
    };
    if (currentMall) {
      fetchStores();
    }
  }, [currentMall]);
  return { stores };
}
