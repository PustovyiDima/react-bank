// import React from "react";
// eslint-disable-next-line
export const REG_EXP_EMAIL = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/);
// eslint-disable-next-line
export const REG_EXP_PASSWORD = new RegExp(
   /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/
);


 
export class Form {

     FIELD_NAME:{[key: string]: string} = {     }
     
     FIELD_ERROR:{[key: string]: string}= {
        IS_EMPTY:"Введіть значення в поле"
     }

    values: any = {};
    error: any = {};
    disabled = true;
 
    change = (name: string, value: string | null) => {
       const error = this.validate(name, value);
       this.values[name] = value;
 
       if (error) {
          this.setError(name, error);
          this.error[name] = error;
       } else {
          this.setError(name, null);
          delete this.error[name];
       }
 
       this.checkDisabled();
    };

    validate = (name: string, value: any): string | undefined => {
        if (String(value).length < 1) {
           return this.FIELD_ERROR.IS_EMPTY;
        }
        
     };
 
    setError = (name: string, error: string | null) => {
       const span = document.querySelector(`.form__error[id="${name}--error"]`);
 
       const field = document.querySelector(`.validation[name="${name}"]`);
 
       if (span) {
          span.classList.toggle("form__error--active", Boolean(error));
          span.textContent = error || "";
       }
       if (field) {
          field.classList.toggle("validation--active", Boolean(error));
       }
    };
 
    checkDisabled = () => {
       let disabled = false;
 
       Object.values(this.FIELD_NAME).forEach((name) => {
          if (this.error[name] || this.values[name] === undefined) {
             disabled = true;
          }
 
          const el = document.querySelector(`.button`);
 
          if (el) {
             el.classList.toggle("button--disabled", Boolean(disabled));
          }
 
          this.disabled = disabled;
       });
 
       this.disabled = disabled;
    };
 
    validateAll = () => {
       let verify: boolean = true;
       Object.values(this.FIELD_NAME).forEach((name) => {
          const error = this.validate(name, this.values[name]);
          // console.log(name);
          if (error) {
             // console.log(error);
             verify = false;
             this.setError(name, error);
          }
       });
       if (verify) {
          this.checkDisabled();
       }
       return verify;
    };
 
    setAlert = (status: string, text: string) => {
       const STATUS_TYPE = ["success", "progress", "error"];
       const el = document.querySelector(".alert");
 
       if (el) {
          if (STATUS_TYPE.includes(status)) {
             el.className = `alert alert--${status}`;
          } else {
             el.className = `alert alert--disabled`;
          }
          if (text) {
             el.textContent = text;
          }
       }
    };
 
    
 }

