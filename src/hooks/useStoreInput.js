import { useState } from "react";
import fetchNodeId from "../services/fetchNodeId";

export default function useStoreInput(currentMall) {
  const [storeName, setStoreName] = useState("");

  const handleStore = async () => {
    const nodeId = await fetchNodeId(currentMall, storeName);
    return nodeId;
  };

  return { storeName, setStoreName, handleStore };
}
