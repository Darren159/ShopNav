import React from "react";
import { Svg, Image, Line } from "react-native-svg";
import { Dimensions } from "react-native";

export default function FloorPlan({ coords1, coords2 }) {
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;
  return (
    <Svg height={screenHeight} width={screenWidth} viewBox="0 0 900 1374">
      <Image
        width="900"
        height="1374"
        href={require("../assets/sample-floorplan.png")}
      />
      {coords1 && coords2 && (
        <Line
          x1={coords1.x}
          y1={coords1.y}
          x2={coords2.x}
          y2={coords2.y}
          stroke="blue"
          strokeWidth="3"
        />
      )}
    </Svg>
  );
}
