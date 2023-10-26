import "./index.css";
import React from "react";

type ComponentProps = {
   name: string;
   label: string;
   type: string;
   action?: React.ChangeEventHandler<HTMLInputElement>;
   error: string | undefined;
   id: string | number;
};
const Component: React.FC<ComponentProps> = ({
   name,
   label,
   type,
   action,
   error,
   id,
}) => {
   const [viewPassword, setPassword] = React.useState<boolean>(false);

   const handleToggle: React.MouseEventHandler<HTMLElement> = (
      event: React.MouseEvent<Element, MouseEvent>
   ) => {
      setPassword(!viewPassword);
   };

   let toogleType = viewPassword ? "text" : type;
   let iconType = viewPassword ? "field__icon-1" : "field__icon-2";

   // const handleInput: React.ChangeEventHandler<HTMLInputElement> | undefined = (
   //    e
   // ) => {
   //    console.log(e.target.name, e.target.value);
   // };

   return (
      <div>
         <div className="field">
            <label className="field__label" htmlFor={`${id}`}>
               {label}
            </label>
            <div className="field__wrapper">
               <input
                  name={name}
                  className="field__input validation"
                  type={toogleType}
                  onChange={action}
                  id={`${id}`}
               />
               <span
                  onClick={handleToggle}
                  className={`field__icon ${iconType}`}
               ></span>
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
