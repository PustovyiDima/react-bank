import "./index.css";
import React from "react";

type ComponentProps = {
   name: string;
   label: string;
   type: string;
   placeholder?: string;
   action?: React.ChangeEventHandler<HTMLInputElement>;
   error?: string | undefined;
};
const Component: React.FC<ComponentProps> = ({
   name,
   label,
   type,
   placeholder,
   action,
   error,
}) => {
   return (
      <div>
         <div className="field">
            <label className="field__label" htmlFor={`${name}`}>
               {label}
            </label>
            <input
               name={name}
               id={name}
               className="field__input validation"
               type={type}
               placeholder={placeholder}
               onInput={action}
            />
            {/* oninput="{{action}}(this.name,this.value)" */}
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
