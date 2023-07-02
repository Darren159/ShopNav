import { useState, useEffect } from "react";
import { SvgUri } from "react-native-svg";
import { View, Dimensions } from "react-native";
import SvgPanZoom from "react-native-svg-pan-zoom";
import { fetchSvgUrl } from "../services/storageService";

const { width, height } = Dimensions.get("window");

export default function Floorplan({ currentMall, currentLevel }) {
  const [svgUrl, setSvgUrl] = useState(null);

  useEffect(() => {
    if (currentMall) {
      fetchSvgUrl(currentMall, currentLevel).then((url) => setSvgUrl(url));
    }
  }, [currentMall, currentLevel]);

  return (
    <View style={{ flex: 0.9 }}>
      <SvgPanZoom
        key={svgUrl}
        canvasHeight={height}
        canvasWidth={width}
        minScale={0.5}
        maxScale={3}
        initialZoom={1.0}
      >
        {svgUrl && <SvgUri uri={svgUrl} width="100%" height="100%" />}
      </SvgPanZoom>
    </View>
  );
}
