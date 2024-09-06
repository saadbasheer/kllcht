import React from "react";

import FlickeringGrid from "./FlickeringGrid";

export default function Background() {
  return (
    <div className="fixed inset-0 z-[-1] w-full h-full overflow-hidden">
      <FlickeringGrid
        squareSize={7}
        gridGap={7}
        color="#dc2626" /* #C63C51 */
        maxOpacity={0.3}
        flickerChance={0.05}
      />
    </div>
  );
}
