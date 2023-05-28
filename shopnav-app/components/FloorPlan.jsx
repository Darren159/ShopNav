import React from "react";
import { Svg, Image, Line } from "react-native-svg";

export default function FloorPlan({ coords1, coords2 }) {
  return (
    <Svg height="1000" width="1000" viewBox="0 0 500 500">
      <Image
        width="100%"
        height="100%"
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
