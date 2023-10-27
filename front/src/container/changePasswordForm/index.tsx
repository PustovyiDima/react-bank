import { AuthContext } from "../../App";
import { Form, REG_EXP_PASSWORD } from "../../utils/form";
import {
   stateServerReduser,
   requestInitialState,
   REQUEST_ACTION_TYPE,
} from "../../utils/serverReducer";
import { saveSession } from "../../utils/session";
import Alert from "../../component/alert";
import Button from "../../component/button";
import Field from "../../component/field";
import FieldPassword from "../../component/field-password";
import "./index.css";
import React, { useContext, useReducer } from "react";

class ChangePasswordForm extends Form {
   FIELD_NAME = {
      PASSWORD: "password",
      PASSWORD_NEW: "password_new",
   };

   FIELD_ERROR = {
      IS_EMPTY: "Введіть значення в поле",
      IS_BIG: "Занадто довге значення. Пориберіть зайве",
      PASSWORD:
         "Пароль повинен складатись не менше ніж з 8 символів, включаючи малі та Великі літери (Aa-Zz) та цифри(1-9)",
   };

   validate = (name: string, value: any): string | undefined => {
      if (String(value).length < 1) {
         return this.FIELD_ERROR.IS_EMPTY;
      }
      if (String(value).length > 30) {
         return this.FIELD_ERROR.IS_BIG;
      }

      if (name === this.FIELD_NAME.PASSWORD) {
         if (!REG_EXP_PASSWORD.test(String(value)))
            return this.FIELD_ERROR.PASSWORD;
      }
      if (name === this.FIELD_NAME.PASSWORD_NEW) {
         if (!REG_EXP_PASSWORD.test(String(value)))
            return this.FIELD_ERROR.PASSWORD;
      }
      return undefined;
   };
}
const changePasswordForm = new ChangePasswordForm();

type InitialState = {
   names: { password: ""; password_new: "" };
   errors: { password: ""; password_new: "" };
};

type State = {
   names: {
      password: string | null;
      password_new: string | null;
   };
   errors: {
      password: string | undefined;
      password_new: string | undefined;
   };
};

type Action = {
   type: ACTION_TYPE;
   payload?: any;
   error?: string | undefined;
};

enum ACTION_TYPE {
   CHANGE_PASSWORD = "CHANGE_PASSWORD",
   CHANGE_PASSWORD_NEW = "CHANGE_PASSWORD_NEW",

   VALIDATE_ALL = "VALIDATE_ALL",
   SUBMIT = "SUBMIT",
}

const stateReducer: React.Reducer<State, Action> = (
   state: State,
   action: Action
): State => {
   const value = action.payload;
   const error = action.error;
   const errors = state.errors;
   const names = state.names;

   switch (action.type) {
      case ACTION_TYPE.CHANGE_PASSWORD:
         changePasswordForm.change("password", value);
         errors.password = error;
         names.password = value;
         return { ...state, names: names, errors: errors };
      case ACTION_TYPE.CHANGE_PASSWORD_NEW:
         changePasswordForm.change("password_new", value);
         errors.password_new = error;
         names.password_new = value;
         return { ...state, names: names, errors: errors };
      case ACTION_TYPE.VALIDATE_ALL:
         const res: boolean = changePasswordForm.validateAll();
         console.log(res);

         console.log("errors", errors);

         return { ...state, errors: errors };
      case ACTION_TYPE.SUBMIT:
         return { ...state, names };
      default:
         return state;
   }
};

const ChangePassword: React.FC = () => {
   const context = useContext(AuthContext);
   const email = context.userState.user.email;

   const [stateServer, dispachServer] = useReducer(
      stateServerReduser,
      requestInitialState
   );

   // ===================================
   const initState: InitialState = {
      names: { password: "", password_new: "" },
      errors: { password: "", password_new: "" },
   };

   const initializer = (state: InitialState): State => ({
      ...state,
      names: { password: "", password_new: "" },
      errors: { password: "", password_new: "" },
   });

   const [state, dispach] = React.useReducer(
      stateReducer,
      initState,
      initializer
   );

   //  ================
   const convertData = (data: {
      email: string;
      password: string;
      password_new: string;
   }) => {
      return JSON.stringify({
         token: context.userState.token,
         email: data.email,
         password: data.password,
         password_new: data.password_new,
      });
   };
   let userSession = useContext(AuthContext);
   const sendData = async (dataToSend: {
      email: string;
      password: string;
      password_new: string;
   }) => {
      dispachServer({ type: REQUEST_ACTION_TYPE.PROGRESS });

      try {
         const res = await fetch("http://localhost:4000/change-password", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: convertData(dataToSend),
         });

         const data = await res.json();
         // console.log(data);
         if (res.ok) {
            const message = "Success";

            dispachServer({
               type: REQUEST_ACTION_TYPE.SUCCESS,
               message: message,
            });
            saveSession(data.session);
            console.log("render newuser");
            userSession.authDisp("LOGIN", data.session);
         } else {
            dispachServer({
               type: REQUEST_ACTION_TYPE.ERROR,
               message: data.message,
            });
            console.log("error");
         }
      } catch (error) {
         const message = "Не можливо підключитись";
         dispachServer({
            type: REQUEST_ACTION_TYPE.ERROR,
            message: message,
         });
         console.log("send-error");
      }
   };

   const handleSubmit = () => {
      const { password, password_new } = state.names;

      if (
         typeof email === "string" &&
         typeof password === "string" &&
         typeof password_new === "string" &&
         changePasswordForm.validateAll()
      ) {
         sendData({ email, password, password_new });
      }
   };

   const handleInput: React.ChangeEventHandler<HTMLInputElement> | undefined = (
      e
   ) => {
      // console.log(e.target.name, e.target.value);
      let error: string | undefined = changePasswordForm.validate(
         e.target.name,
         e.target.value
      );
      // console.log(error);
      if (e.target.name === "password") {
         dispach({
            type: ACTION_TYPE.CHANGE_PASSWORD,
            payload: e.target.value,
            error: error,
         });
      }
      if (e.target.name === "password_new") {
         dispach({
            type: ACTION_TYPE.CHANGE_PASSWORD_NEW,
            payload: e.target.value,
            error: error,
         });
      }
   };

   return (
      <React.Fragment key={2}>
         <div className="form">
            <div className="form__title">Change Password</div>
            <div className="form__item">
               <FieldPassword
                  action={handleInput}
                  label="Old password"
                  type="password"
                  name="password"
                  error={state.errors.password}
                  id={"field-0003"}
               />
            </div>
            <div className="form__item">
               <FieldPassword
                  action={handleInput}
                  label="New password"
                  type="password"
                  name="password_new"
                  error={state.errors.password_new}
                  id={"field-0004"}
               />
            </div>

            <Button onClick={handleSubmit} outline>
               Continue
            </Button>

            {stateServer.status && (
               <Alert
                  status={stateServer.status}
                  message={stateServer.message}
               />
            )}
         </div>
      </React.Fragment>
   );
};

export default ChangePassword;
