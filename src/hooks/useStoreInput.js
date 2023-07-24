import { useState } from "react";
import fetchStore from "../services/fetchStore";

export default function useStoreInput(currentMall) {
  const [storeName, setStoreName] = useState("");

  const handleClick = async () => {
    let storeId;
    try {
      storeId = await fetchStore(currentMall, storeName);
    } catch (error) {
      throw new Error("Invalid Store Name");
    }
    return storeId;
  };

  return { storeName, setStoreName, handleClick };
}
