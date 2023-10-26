import "./index.css";
import React, { useContext } from "react";

import Grid from "../../component/grid";
import BackBtn from "../../component/back-button";
import Field from "../../component/field";
import FieldMoney from "../../component/field-money";
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
import { AuthContext } from "../../App";
import { Loader } from "../../component/sceleton";
const TRANSACTION_TYPE = {
   SEND: "send",
   RECEIVE: "receive",
};

class SendForm extends Form {
   FIELD_NAME = {
      EMAIL: "email",
      SUMM: "summ",
   };

   FIELD_ERROR = {
      IS_EMPTY: "Введіть значення в поле",
      IS_BIG: "Занадто довге значення. Пориберіть зайве",
      EMAIL: "Значення e-mail адреси введене не коректно",
      IS_MINUS: "Значення повинно бути більше нуля",
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
      if (name === this.FIELD_NAME.SUMM && Number(value) < 0) {
         return this.FIELD_ERROR.IS_MINUS;
      }
      return undefined;
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
}
const sendForm = new SendForm();

type InitialState = {
   names: { email: ""; summ: null };
   errors: { email: ""; summ: "" };
};

type State = {
   names: { email: string | null; summ: number | null };
   errors: { email: string | undefined; summ: string | undefined };
};

type Action = {
   type: ACTION_TYPE;
   payload?: any;
   error?: string | undefined;
};

enum ACTION_TYPE {
   CHANGE_EMAIL = "CHANGE_EMAIL",
   CHANGE_SUMM = "CHANGE_SUMM",

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
         sendForm.change("email", value);
         errors.email = error;
         names.email = value;
         return { ...state, names: names, errors: errors };
      case ACTION_TYPE.CHANGE_SUMM:
         sendForm.change("summ", value);
         errors.summ = error;
         names.summ = value;
         return { ...state, names: names, errors: errors };
      case ACTION_TYPE.VALIDATE_ALL:
         const res: boolean = sendForm.validateAll();
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
      names: { email: "", summ: null },
      errors: { email: "", summ: "" },
   };

   const initializer = (state: InitialState): State => ({
      ...state,
      names: { email: "", summ: null },
      errors: { email: "", summ: "" },
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
      let error: string | undefined = sendForm.validate(
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
      if (e.target.name === "summ") {
         dispach({
            type: ACTION_TYPE.CHANGE_SUMM,
            payload: e.target.value,
            error: error,
         });
      }
   };

   const [stateServer, dispachServer] = React.useReducer(
      stateServerReduser,
      requestInitialState
   );

   // ==========

   const convertData = (data: {
      id: number;
      type: string;
      target: string;
      summ: number;
   }) => {
      return JSON.stringify({
         id: data.id,
         type: data.type,
         target: data.target,
         summ: data.summ,
      });
   };
   let context = useContext(AuthContext);
   const sendData = async (dataToSend: {
      id: number;
      type: string;
      target: string;
      summ: number;
   }) => {
      dispachServer({ type: REQUEST_ACTION_TYPE.PROGRESS });

      try {
         const res = await fetch("http://localhost:4000/send", {
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
      const { email, summ } = state.names;
      console.log(email, summ);

      if (typeof email === "string" && summ !== null && summ > 0) {
         console.log(
            context.userState.user.id,
            TRANSACTION_TYPE.SEND,
            email,
            summ
         );
         sendData({
            id: context.userState.user.id,
            type: TRANSACTION_TYPE.SEND,
            target: email,
            summ: summ,
         });
      }
   };

   React.useEffect(() => {
      sendForm.validateAll();
      sendForm.checkDisabled();
   }, [state]);

   return (
      <section className="form-section">
         <div style={{ padding: "10px 20px 22px" }}>
            <BackBtn title="Send" />
         </div>

         <div style={{ display: "grid", gap: "32px" }}>
            <div className="form">
               <div className="form__item">
                  <Field
                     action={handleInput}
                     label="Email"
                     type="email"
                     name="email"
                     placeholder="yourmail@mail.com"
                     error={state.errors.email}
                     id={"field-0015"}
                  />
               </div>
               <div className="form__item">
                  <FieldMoney
                     action={handleInput}
                     label="SUMM"
                     type="number"
                     name="summ"
                     error={state.errors.summ}
                     id={"field-0016"}
                  />
               </div>

               <Button onClick={handleSubmit}>SEND</Button>

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
