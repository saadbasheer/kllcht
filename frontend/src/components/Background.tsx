import React from "react";

import FlickeringGrid from "./ui/FlickeringGrid";

export default function Background() {
  return (
    <div className="-z-10 absolute inset-0">
      <FlickeringGrid
        squareSize={7}
        gridGap={7}
        color="#C63C51"
        maxOpacity={0.3}
        flickerChance={0.05}
      />
    </div>
  );
}
