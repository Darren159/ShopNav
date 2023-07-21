import { createContext, useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig";

export const MallContext = createContext();

export function MallProvider({ children }) {
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
  const value = useMemo(
    () => ({ malls, currentMall, setCurrentMall }),
    [malls, currentMall]
  );

  return <MallContext.Provider value={value}>{children}</MallContext.Provider>;
}

MallProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
