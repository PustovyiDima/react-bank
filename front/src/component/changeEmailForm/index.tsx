import { AuthContext } from "../../App";
import { Form, REG_EXP_EMAIL, REG_EXP_PASSWORD } from "../../utils/form";
import {
   stateServerReduser,
   requestInitialState,
   REQUEST_ACTION_TYPE,
} from "../../utils/serverReducer";
import { saveSession } from "../../utils/session";
import Alert from "../alert";
import Button from "../button";
import Field from "../field";
import FieldPassword from "../field-password";
import "./index.css";
import React, { useContext, useReducer } from "react";

class ChengeEmailForm extends Form {
   FIELD_NAME = {
      EMAIL: "email",
      PASSWORD: "password",
   };

   FIELD_ERROR = {
      IS_EMPTY: "Введіть значення в поле",
      IS_BIG: "Занадто довге значення. Пориберіть зайве",
      EMAIL: "Значення e-mail адреси введене не коректно",
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
      if (name === this.FIELD_NAME.EMAIL) {
         if (!REG_EXP_EMAIL.test(String(value))) {
            return this.FIELD_ERROR.EMAIL;
         }
      }
      if (name === this.FIELD_NAME.PASSWORD) {
         if (!REG_EXP_PASSWORD.test(String(value)))
            return this.FIELD_ERROR.PASSWORD;
      }
      return undefined;
   };
}
const chengeEmailForm = new ChengeEmailForm();

type InitialState = {
   names: { email: ""; password: "" };
   errors: { email: ""; password: "" };
};

type State = {
   names: {
      email: string | null;
      password: string | null;
   };
   errors: {
      email: string | undefined;
      password: string | undefined;
   };
};

type Action = {
   type: ACTION_TYPE;
   payload?: any;
   error?: string | undefined;
};

enum ACTION_TYPE {
   CHANGE_EMAIL = "CHANGE_EMAIL",
   CHANGE_PASSWORD = "CHANGE_PASSWORD",

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
      case ACTION_TYPE.CHANGE_EMAIL:
         chengeEmailForm.change("email", value);
         errors.email = error;
         names.email = value;
         return { ...state, names: names, errors: errors };
      case ACTION_TYPE.CHANGE_PASSWORD:
         chengeEmailForm.change("password", value);
         errors.password = error;
         names.password = value;
         return { ...state, names: names, errors: errors };

      case ACTION_TYPE.VALIDATE_ALL:
         const res: boolean = chengeEmailForm.validateAll();
         console.log(res);

         console.log("errors", errors);

         return { ...state, errors: errors };
      case ACTION_TYPE.SUBMIT:
         return { ...state, names };
      default:
         return state;
   }
};

type ComponentProps = {
   title?: string;
   text?: string;
};
const ChangeEmail: React.FC<ComponentProps> = ({ title, text }) => {
   const context = useContext(AuthContext);
   const user_email = context.userState.user.email;

   const [stateServer, dispachServer] = useReducer(
      stateServerReduser,
      requestInitialState
   );

   // ===================================
   const initState: InitialState = {
      names: { email: "", password: "" },
      errors: { email: "", password: "" },
   };

   const initializer = (state: InitialState): State => ({
      ...state,
      names: { email: "", password: "" },
      errors: { email: "", password: "" },
   });

   const [state, dispach] = React.useReducer(
      stateReducer,
      initState,
      initializer
   );

   //  ================
   const convertData = (data: {
      user_email: string;
      email: string;
      password: string;
   }) => {
      return JSON.stringify({
         user_email: data.user_email,
         email: data.email,
         password: data.password,
      });
   };
   let userSession = useContext(AuthContext);
   const sendData = async (dataToSend: {
      user_email: string;
      email: string;
      password: string;
   }) => {
      dispachServer({ type: REQUEST_ACTION_TYPE.PROGRESS });

      try {
         const res = await fetch("http://localhost:4000/change-email", {
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
            // userSession.authDisp("LOGIN", data.session);
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
      const { email, password } = state.names;

      if (
         typeof user_email === "string" &&
         typeof email === "string" &&
         typeof password === "string" &&
         chengeEmailForm.validateAll()
      ) {
         sendData({ user_email, email, password });
      }
   };

   const handleInput: React.ChangeEventHandler<HTMLInputElement> | undefined = (
      e
   ) => {
      // console.log(e.target.name, e.target.value);
      let error: string | undefined = chengeEmailForm.validate(
         e.target.name,
         e.target.value
      );
      // console.log(error);
      if (e.target.name === "email") {
         dispach({
            type: ACTION_TYPE.CHANGE_EMAIL,
            payload: e.target.value,
            error: error,
         });
      }
      if (e.target.name === "password") {
         dispach({
            type: ACTION_TYPE.CHANGE_PASSWORD,
            payload: e.target.value,
            error: error,
         });
      }
   };

   return (
      <React.Fragment key={1}>
         <div className="form">
            <div className="form__title">Change email</div>
            <div className="form__item">
               <Field
                  action={handleInput}
                  label="Email"
                  type="email"
                  name="email"
                  placeholder="yourmail@mail.com"
                  error={state.errors.email}
                  id={"field-0001"}
               />
            </div>
            <div className="form__item">
               <FieldPassword
                  action={handleInput}
                  label="Old password"
                  type="password"
                  name="password"
                  error={state.errors.password}
                  id={"field-0002"}
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

export default ChangeEmail;
