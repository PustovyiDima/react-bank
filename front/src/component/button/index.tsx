import "./index.css";
import React from "react";

type ButtonProps = {
   children: string;
   onClick: React.MouseEventHandler<HTMLButtonElement>;
   outline?: boolean;
};
const Button: React.FC<ButtonProps> = ({ children, onClick, outline }) => {
   const style = outline ? {} : {};
   return (
      <button
         className={`button ${outline ? "button--outline" : ""}`}
         style={style}
         onClick={onClick}
      >
         {children}
      </button>
   );
};

export default Button;
