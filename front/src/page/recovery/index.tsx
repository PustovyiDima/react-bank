import "./index.css";
import React from "react";

import BackBtn from "../../component/back-button";
import Field from "../../component/field";
import Title from "../../component/title";
import Button from "../../component/button";
import Alert from "../../component/alert";

import { useNavigate } from "react-router-dom";
import { saveSession } from "../../utils/session";

import { Form, REG_EXP_EMAIL } from "../../utils/form";

import {
   stateServerReduser,
   requestInitialState,
   REQUEST_ACTION_TYPE,
} from "../../utils/serverReducer";
import { Loader } from "../../component/sceleton";

class RecoveryForm extends Form {
   FIELD_NAME = {
      EMAIL: "email",
   };

   FIELD_ERROR = {
      IS_EMPTY: "Введіть значення в поле",
      IS_BIG: "Занадто довге значення. Пориберіть зайве",
      EMAIL: "Значення e-mail адреси введене не коректно",
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
      return undefined;
   };
}
const recoveryForm = new RecoveryForm();

type InitialState = {
   names: { email: "" };
   errors: { email: "" };
};

type State = {
   names: { email: string | null };
   errors: { email: string | undefined };
};

type Action = {
   type: ACTION_TYPE;
   payload?: any;
   error?: string | undefined;
};

enum ACTION_TYPE {
   CHANGE_EMAIL = "CHANGE_EMAIL",
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
         recoveryForm.change("email", value);
         errors.email = error;
         names.email = value;
         return { ...state, names: names, errors: errors };
      case ACTION_TYPE.VALIDATE_ALL:
         const res: boolean = recoveryForm.validateAll();
         console.log(res);

         console.log("errors", errors);

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
      names: { email: "" },
      errors: { email: "" },
   };

   const initializer = (state: InitialState): State => ({
      ...state,
      names: { email: "" },
      errors: { email: "" },
   });

   const [state, dispach] = React.useReducer(
      stateReducer,
      initState,
      initializer
   );

   const handleInput: React.ChangeEventHandler<HTMLInputElement> | undefined = (
      e
   ) => {
      console.log(e.target.name, e.target.value);
      let error: string | undefined = recoveryForm.validate(
         e.target.name,
         e.target.value
      );
      console.log(error);
      if (e.target.name === "email") {
         dispach({
            type: ACTION_TYPE.CHANGE_EMAIL,
            payload: e.target.value,
            error: error,
         });
      }
   };

   React.useEffect(() => {
      // console.log(state);
      // const { errors, names } = state;
      recoveryForm.validateAll();
      recoveryForm.checkDisabled();
   }, [state]);

   const [stateServer, dispachServer] = React.useReducer(
      stateServerReduser,
      requestInitialState
   );

   // ==========

   const convertData = (data: { email: string }) => {
      return JSON.stringify({ email: data.email });
   };

   const sendData = async (dataToSend: { email: string }) => {
      dispachServer({ type: REQUEST_ACTION_TYPE.PROGRESS });

      try {
         const res = await fetch("http://localhost:4000/recovery", {
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
            navigate(`/recovery-confirm`);
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
      const { email } = state.names;

      if (typeof email === "string" && recoveryForm.validateAll()) {
         sendData({ email });
      }
   };

   return (
      <section className="form-section">
         <div style={{ padding: "10px 20px 22px" }}>
            <BackBtn />
         </div>

         <div style={{ display: "grid", gap: "32px" }}>
            <Title
               title={"Recover password"}
               text={"Choose a recovery method"}
            ></Title>

            <div className="form">
               <div className="form__item">
                  <Field
                     action={handleInput}
                     label="Email"
                     type="email"
                     name="email"
                     placeholder="yourmail@mail.com"
                     error={state.errors.email}
                     id={"field-0005"}
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
