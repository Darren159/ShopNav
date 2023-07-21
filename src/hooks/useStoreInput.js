import { useState } from "react";

export default function useStoreInput(currentMall) {
  const [storeName, setStoreName] = useState("");
  const [storeError, setStoreError] = useState(false);

  const handleClick = async (getNodeIDFromStoreName) => {
    setStoreError(false); // Clear the previous errors
    let nodeId;
    try {
      nodeId = await getNodeIDFromStoreName(currentMall, storeName);
    } catch (error) {
      setStoreError(true);
    }
    return nodeId;
  };

  return { storeName, setStoreName, storeError, handleClick };
}
