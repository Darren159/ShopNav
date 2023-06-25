import { useState, useEffect } from "react";
import { SvgUri } from "react-native-svg";
import { View, Dimensions } from "react-native";
import SvgPanZoom from "react-native-svg-pan-zoom";
import { storage } from "../firebaseConfig";
import { getDownloadURL, ref } from "firebase/storage";

const { width, height } = Dimensions.get("window");

export default function Floorplan({ mallName, currentLevel }) {
  const [svgUrl, setSvgUrl] = useState(null);

  useEffect(() => {
    const fetchSvgUrl = async () => {
      const svgPath = `/${mallName}/${currentLevel}.svg`;
      const url = await getDownloadURL(ref(storage, svgPath));
      setSvgUrl(url);
    };
    fetchSvgUrl();
  }, [mallName, currentLevel]);

  return (
    <View style={{ flex: 0.9 }}>
      <SvgPanZoom
        key={svgUrl}
        canvasHeight={height}
        canvasWidth={width}
        minScale={0.5}
        maxScale={3}
        initialZoom={1.0}
        onZoom={(zoom) => {
          console.log("onZoom:" + zoom);
        }}
      >
        {svgUrl && <SvgUri uri={svgUrl} width="100%" height="100%" />}
      </SvgPanZoom>
    </View>
  );
}
