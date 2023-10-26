import "./index.css";
import React from "react";

type AlertData = {
   message: string | null | undefined;
   status?: string;
};
const Alert: React.FC<AlertData> = ({
   message,
   status = "default",
}): JSX.Element => {
   return <div className={`alert alert--${status}`}>{message}</div>;
};

export default Alert;
