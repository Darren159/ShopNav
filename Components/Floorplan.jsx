import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { SvgUri } from "react-native-svg";
import { ActivityIndicator } from "react-native";
import fetchSvgUrl from "../services/storageService";

export default function Floorplan({ currentMall, currentLevel }) {
  const [svgUrl, setSvgUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (currentMall) {
      setIsLoading(true);
      fetchSvgUrl(currentMall, currentLevel).then((url) => {
        setSvgUrl(url);
        setIsLoading(false); // set loading state to false after SVG is fetched
      });
    }
  }, [currentMall, currentLevel]);

  return isLoading ? (
    <ActivityIndicator size="large" /> // show spinner if isLoading is true
  ) : (
    <SvgUri
      key={currentLevel}
      uri={svgUrl}
      width="100%"
      height="100%"
      style={{ backgroundColor: "#33AAFF" }}
    />
  );
}

Floorplan.propTypes = {
  currentMall: PropTypes.string.isRequired,
  currentLevel: PropTypes.number.isRequired,
};
