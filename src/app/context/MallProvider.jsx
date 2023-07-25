import { createContext, useState, useEffect, useMemo } from "react";
import { Alert } from "react-native";
import PropTypes from "prop-types";
import fetchMalls from "../../services/fetchMalls";

export const MallContext = createContext();

export function MallProvider({ children }) {
  const [malls, setMalls] = useState([]);
  const [currentMall, setCurrentMall] = useState(null);

  useEffect(() => {
    const initializeMalls = async () => {
      try {
        const mallList = await fetchMalls();
        setMalls(mallList);
        setCurrentMall(mallList[0]); // Set the first mall as the current mall
      } catch (error) {
        Alert.alert("Error", error.message, [{ text: "OK" }], {
          cancelable: false,
        });
      }
    };
    initializeMalls();
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
