import React, { useState, useEffect } from "react";
import { SvgUri } from "react-native-svg";
import { View, Dimensions } from "react-native";
import SvgPanZoom from "react-native-svg-pan-zoom";
import storage from "../firebaseConfig";
import { getDownloadURL, ref } from "firebase/storage";
import { Picker } from "@react-native-picker/picker";
import { SafeAreaView } from "react-native-safe-area-context";

const malls = [
  "Westgate",
  "Suntec", // add more mall names here...
];

const { width, height } = Dimensions.get("window");

export default function Directory() {
  const [currentMall, setCurrentMall] = useState(malls[0]);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [svgUrl, setSvgUrl] = useState(null);

  useEffect(() => {
    const fetchSvgUrl = async () => {
      const svgPath = `/${currentMall}/${currentLevel}.svg`;
      const url = await getDownloadURL(ref(storage, svgPath));
      setSvgUrl(url);
    };
    fetchSvgUrl();
  }, [currentMall, currentLevel]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{ flex: 0.1, flexDirection: "row", justifyContent: "center" }}
      >
        <View style={{ height: 50, width: 150 }}>
          <Picker
            selectedValue={currentMall}
            onValueChange={(value) => setCurrentMall(value)}
          >
            {malls.map((mall, index) => (
              <Picker.Item key={index} label={mall} value={mall} />
            ))}
          </Picker>
        </View>
        <View style={{ height: 50, width: 150 }}>
          <Picker
            selectedValue={currentLevel}
            onValueChange={(value) => setCurrentLevel(value)}
          >
            {[1, 2, 3, 4, 5].map((level) => (
              <Picker.Item key={level} label={`Level ${level}`} value={level} />
            ))}
          </Picker>
        </View>
      </View>
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
    </SafeAreaView>
  );
}
