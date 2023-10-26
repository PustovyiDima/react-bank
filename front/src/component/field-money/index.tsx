import "./index.css";
import React, { CSSProperties } from "react";

type ComponentProps = {
   name: string;
   label: string;
   type: string;
   placeholder?: string;
   action?: React.ChangeEventHandler<HTMLInputElement>;
   error?: string | undefined;
   id: string | number;
};
const Component: React.FC<ComponentProps> = ({
   name,
   label,
   type,
   placeholder,
   action,
   error,
   id,
}) => {
   return (
      <div>
         <div className="field">
            <label className="field__label" htmlFor={`${id}`}>
               {label}
            </label>
            <div style={wrapper}>
               <span style={fieldIcon}>$</span>
               <input
                  name={name}
                  id={`${id}`}
                  className="field__input validation"
                  type={type}
                  placeholder={placeholder}
                  onInput={action}
                  style={input}
               />
            </div>
         </div>
         {error && (
            <span id={`${name}--error`} className="form__error">
               {error}
            </span>
         )}
      </div>
   );
};

export default Component;

const wrapper: CSSProperties = {
   width: "100%",
   display: "grid",
   position: "relative",
};

const input: CSSProperties = {
   paddingLeft: "36px",
};

const fieldIcon: CSSProperties = {
   display: "block",
   width: "20px",
   height: "20px",
   cursor: "pointer",
   position: "absolute",
   left: "16px",
   top: "calc(50% - 8px)",
   zIndex: "1",
   fontSize: "16px",
};
