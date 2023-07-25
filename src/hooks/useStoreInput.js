import { useState } from "react";
import fetchStoreId from "../services/fetchStoreId";

export default function useStoreInput(currentMall) {
  const [storeName, setStoreName] = useState("");

  const handleStore = async () => {
    const nodeId = await fetchStoreId(currentMall, storeName);
    return nodeId;
  };

  return { storeName, setStoreName, handleStore };
}
