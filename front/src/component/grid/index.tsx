import "./index.css";
import React, { ReactHTML } from "react";

type GridProps = {
   children: React.ReactElement;
   gap?: number;
   center?: boolean;
};
const Grid: React.FC<GridProps> = ({ children, gap = 20, center }) => {
   const pos = center ? "center" : "start";
   return (
      <div
         style={{
            display: "flex",
            flexDirection: "column",
            gap: `${gap}px`,
            alignItems: pos,
         }}
      >
         <>{children}</>
      </div>
   );
};

export default Grid;
