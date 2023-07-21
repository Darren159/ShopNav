import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig";

export default function useMalls() {
  const [malls, setMalls] = useState([]);
  const [currentMall, setCurrentMall] = useState(null);

  useEffect(() => {
    const fetchMalls = async () => {
      const mallCollection = collection(db, "malls");
      const mallSnapshot = await getDocs(mallCollection);
      const mallList = mallSnapshot.docs.map((mall) => mall.id);
      setMalls(mallList);
      setCurrentMall(mallList[0]); // Set the first mall as the current mall
    };
    fetchMalls();
  }, []);

  return { malls, currentMall, setCurrentMall };
}
