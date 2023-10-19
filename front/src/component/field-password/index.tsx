import "./index.css";
import React from "react";

type ComponentProps = {
   name: string;
   label: string;
   type: string;
   action?: string;
};
const Component: React.FC<ComponentProps> = ({ name, label, type }) => {
   const handleInput = () => {};
   const [viewPassword, setPassword] = React.useState<boolean>(false);

   const handleToggle: React.MouseEventHandler<HTMLElement> = (
      event: React.MouseEvent<Element, MouseEvent>
   ) => {
      setPassword(!viewPassword);
   };

   let toogleType = viewPassword ? "text" : type;
   let iconType = viewPassword ? "field__icon-1" : "field__icon-2";

   return (
      <div>
         <div className="field">
            <label className="field__label" htmlFor={`${name}`}>
               {label}
            </label>
            <div className="field__wrapper">
               <input
                  name={name}
                  id={name}
                  className="field__input validation"
                  type={toogleType}
                  onInput={handleInput}
               />
               <span
                  onClick={handleToggle}
                  className={`field__icon ${iconType}`}
               ></span>
            </div>
         </div>
         {/* <span name="email" class="form__error">
            Помилка
         </span> */}
      </div>
   );
};

export default Component;
