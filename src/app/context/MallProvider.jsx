import { createContext, useState, useEffect, useMemo } from "react";
import { Alert } from "react-native";
import PropTypes from "prop-types";
import fetchMalls from "../../services/fetchMalls";

// The MallContext provides an interface to share state about malls
// across the components of the application.
export const MallContext = createContext();

// The MallProvider is a component that wraps around components
// and provides them access to the shared mall state.
export function MallProvider({ children }) {

  // malls - an array of malls.
  // currentMall - currently selected mall.
  const [malls, setMalls] = useState([]);
  const [currentMall, setCurrentMall] = useState(null);


  // Upon the component's mount, fetches mall data and sets 
  // the state variables `malls` and `currentMall`.
  useEffect(() => {
    const initializeMalls = async () => {
      try {
        const mallList = await fetchMalls();
        setMalls(mallList);
        setCurrentMall(mallList[0]); // Set the first mall as the current mall
      } catch (error) {
        // Alert message when there is an Errorr
        Alert.alert("Error", error.message, [{ text: "OK" }], {
          cancelable: false,
        });
      }
    };
    initializeMalls();
  }, []);

  // useMemo is used to prevent unnecessary re-renders and computations 
  // if the `malls` or `currentMall` states haven't changed.
  const value = useMemo(
    () => ({ malls, currentMall, setCurrentMall }),
    [malls, currentMall]
  );

  // The MallContext.Provider component makes the mall context available 
  // to all child components of this MallProvider component.
  return <MallContext.Provider value={value}>{children}</MallContext.Provider>;
}

MallProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
