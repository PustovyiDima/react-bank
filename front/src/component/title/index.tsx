import "./index.css";
import React from "react";
import Grid from "../grid";

type ComponentProps = {
   title: string;
   text?: string;
};
const Component: React.FC<ComponentProps> = ({ title, text }) => {
   return (
      <Grid gap={12} center>
         <>
            <h1 className="title">{title}</h1>
            <p className="info">{text}</p>
         </>
      </Grid>
   );
};

export default Component;
