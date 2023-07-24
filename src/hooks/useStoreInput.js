import { useState } from "react";
import fetchStore from "../services/fetchStore";

export default function useStoreInput(currentMall) {
  const [storeName, setStoreName] = useState("");

  const handleStore = async () => {
    const storeId = await fetchStore(currentMall, storeName);
    return storeId;
  };

  return { storeName, setStoreName, handleStore };
}
