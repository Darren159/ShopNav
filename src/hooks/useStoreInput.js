import { useState } from "react";
import fetchStoreId from "../services/fetchStoreId";

export default function useStoreInput(currentMall) {
  const [storeName, setStoreName] = useState("");

  const handleStore = async () => {
    const storeId = await fetchStoreId(currentMall, storeName);
    return storeId;
  };

  return { storeName, setStoreName, handleStore };
}
