import "./index.css";
import React from "react";

type ComponentProps = {
   name: string;
   label: string;
   type: string;
   placeholder?: string;
   action?: string;
};
const Component: React.FC<ComponentProps> = ({
   name,
   label,
   type,
   placeholder,
}) => {
   const handleInput = () => {};
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
               onInput={handleInput}
            />
            {/* oninput="{{action}}(this.name,this.value)" */}
         </div>
         {/* <span name="email" class="form__error">
            Помилка
         </span> */}
      </div>
   );
};

export default Component;
