import "./index.css";
import React from "react";

type ComponentProps = {
   title?: string;
   text?: string;
};
const Component: React.FC<ComponentProps> = ({ title, text }) => {
   return (
      <div>
         <></>
      </div>
   );
};

export default Component;
