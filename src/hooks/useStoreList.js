import { useState, useEffect } from "react";
import fetchStoreList from "../services/fetchStoreList";

export default function useStoreList(currentMall) {
  const [stores, setStores] = useState([]);

  useEffect(() => {
    const fetchAndSetStores = async () => {
      if (currentMall) {
        const storeList = await fetchStoreList(currentMall);
        setStores(storeList);
      }
    };
    fetchAndSetStores();
  }, [currentMall]);

  return { stores };
}
