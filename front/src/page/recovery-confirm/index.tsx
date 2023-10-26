import "./index.css";
import React from "react";

import Grid from "../../component/grid";
import BackBtn from "../../component/back-button";
import Field from "../../component/field";
import FieldPassword from "../../component/field-password";
import Title from "../../component/title";
import Button from "../../component/button";
import Alert from "../../component/alert";

import { useNavigate, Link } from "react-router-dom";
import { saveSession } from "../../utils/session";

import { Form, REG_EXP_EMAIL, REG_EXP_PASSWORD } from "../../utils/form";

import {
   stateServerReduser,
   requestInitialState,
   REQUEST_ACTION_TYPE,
} from "../../utils/serverReducer";
import { Loader } from "../../component/sceleton";

class RecoveryConfirmForm extends Form {
   FIELD_NAME = {
      CODE: "code",
      PASSWORD: "password",
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

      return undefined;
   };
}
const recoveryConfirmForm = new RecoveryConfirmForm();

type InitialState = {
   names: { code: null; password: "" };
   errors: { code: ""; password: "" };
};

type State = {
   names: { code: number | null; password: string | null };
   errors: { code: string | undefined; password: string | undefined };
};

type Action = {
   type: ACTION_TYPE;
   payload?: any;
   error?: string | undefined;
};

enum ACTION_TYPE {
   CHANGE_CODE = "CHANGE_CODE",
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
      case ACTION_TYPE.CHANGE_CODE:
         recoveryConfirmForm.change("code", value);
         errors.code = error;
         names.code = value;
         return { ...state, names: names, errors: errors };
      case ACTION_TYPE.CHANGE_PASSWORD:
         recoveryConfirmForm.change("password", value);
         errors.password = error;
         names.password = value;
         return { ...state, names: names, errors: errors };
      case ACTION_TYPE.VALIDATE_ALL:
         const res: boolean = recoveryConfirmForm.validateAll();
         // console.log(res);

         // console.log("errors", errors);

         return { ...state, errors: errors };
      case ACTION_TYPE.SUBMIT:
         return { ...state, names };
      default:
         return state;
   }
};

export default function Container() {
   const navigate = useNavigate();
   const initState: InitialState = {
      names: { code: null, password: "" },
      errors: { code: "", password: "" },
   };

   const initializer = (state: InitialState): State => ({
      ...state,
      names: { code: null, password: "" },
      errors: { code: "", password: "" },
   });

   const [state, dispach] = React.useReducer(
      stateReducer,
      initState,
      initializer
   );

   const handleInput: React.ChangeEventHandler<HTMLInputElement> | undefined = (
      e
   ) => {
      // console.log(e.target.name, e.target.value);
      let error: string | undefined = recoveryConfirmForm.validate(
         e.target.name,
         e.target.value
      );
      // console.log(error);
      if (e.target.name === "code") {
         dispach({
            type: ACTION_TYPE.CHANGE_CODE,
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

   React.useEffect(() => {
      // console.log(state);
      // const { errors, names } = state;
      recoveryConfirmForm.validateAll();
      recoveryConfirmForm.checkDisabled();
   }, [state]);

   const [stateServer, dispachServer] = React.useReducer(
      stateServerReduser,
      requestInitialState
   );

   // ==========

   const convertData = (data: { code: number; password: string }) => {
      return JSON.stringify({ code: data.code, password: data.password });
   };

   const sendData = async (dataToSend: { code: number; password: string }) => {
      dispachServer({ type: REQUEST_ACTION_TYPE.PROGRESS });

      try {
         const res = await fetch("http://localhost:4000/recovery-confirm", {
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

            // const user = data.session.user.email;
            navigate(`/balance`);
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
      const { code, password } = state.names;

      console.log(code != null);
      if (
         code != null &&
         password != null &&
         recoveryConfirmForm.validateAll()
      ) {
         sendData({ code, password });
      } else {
         console.log("Data not sendet");
      }
   };

   return (
      <section className="form-section">
         <div style={{ padding: "10px 20px 22px" }}>
            <BackBtn />
         </div>

         <div style={{ display: "grid", gap: "32px" }}>
            <Title
               title={"Sign up"}
               text={"Choose a registration method"}
            ></Title>

            <div className="form">
               <div className="form__item">
                  <Field
                     action={handleInput}
                     label="Code"
                     type="number"
                     name="code"
                     error={state.errors.code}
                     id={"field-0006"}
                  />
               </div>
               <div className="form__item">
                  <FieldPassword
                     action={handleInput}
                     label="Password"
                     type="password"
                     name="password"
                     error={state.errors.password}
                     id={"field-0007"}
                  />
               </div>

               <Button onClick={handleSubmit}>Send code</Button>
               {stateServer.status === REQUEST_ACTION_TYPE.PROGRESS && (
                  <Loader />
               )}
               {stateServer.status && (
                  <Alert
                     status={stateServer.status}
                     message={stateServer.message}
                  />
               )}
            </div>
         </div>
      </section>
   );
}
