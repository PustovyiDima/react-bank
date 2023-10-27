import "./index.css";
import React, { useContext } from "react";

import { useNavigate } from "react-router-dom";
import BackBtn from "../../component/back-button";
import Field from "../../component/field-money";
import {
   REQUEST_ACTION_TYPE,
   requestInitialState,
   stateServerReduser,
} from "../../utils/serverReducer";
import { AuthContext } from "../../App";
import { Form } from "../../utils/form";
import { Loader } from "../../component/sceleton";

const TRANSACTION_TYPE = {
   SEND: "send",
   RECEIVE: "receive",
};

class ReciveForm extends Form {
   FIELD_NAME = {
      SUMM: "SUMM",
   };

   FIELD_ERROR = {
      IS_EMPTY: "Введіть значення в поле",
      IS_BIG: "Занадто довге значення. Пориберіть зайве",
      IS_MINUS: "Значення повинно бути більше нуля",
   };

   validate = (name: string, value: any): string | undefined => {
      if (String(value).length < 1) {
         return this.FIELD_ERROR.IS_EMPTY;
      }
      if (String(value).length > 10) {
         return this.FIELD_ERROR.IS_BIG;
      }
      if (Number(value) < 0) {
         return this.FIELD_ERROR.IS_MINUS;
      }
   };

   checkDisabled = () => {
      let disabled = false;

      Object.values(this.FIELD_NAME).forEach((name) => {
         if (this.error[name] || this.values[name] === undefined) {
            disabled = true;
         }

         const el = document.querySelectorAll(`.send-button`);

         if (el) {
            el.forEach((element) => {
               element.classList.toggle(
                  "send-button--disabled",
                  Boolean(disabled)
               );
            });
         }

         this.disabled = disabled;
      });

      this.disabled = disabled;
   };
}
const reciveForm = new ReciveForm();
// ==================================
type InitialState = {
   SUMM: null;
   errors: { SUMM: "" };
};

type State = {
   SUMM: number | null;
   errors: { SUMM: string | undefined };
};

type Action = {
   type: ACTION_TYPE;
   payload?: any;
   error?: string | undefined;
};

enum ACTION_TYPE {
   CHANGE_SUMM = "CHANGE_SUMM",
   VALIDATE_ALL = "VALIDATE_ALL",
}

const stateReducer: React.Reducer<State, Action> = (
   state: State,
   action: Action
): State => {
   const value = action.payload;
   const error = action.error;
   const errors = state.errors;

   switch (action.type) {
      case ACTION_TYPE.CHANGE_SUMM:
         reciveForm.change("SUMM", value);
         errors.SUMM = error;
         return { ...state, SUMM: value, errors: errors };

      case ACTION_TYPE.VALIDATE_ALL:
         reciveForm.validateAll();
         return { ...state, errors: errors };
      default:
         return state;
   }
};

export default function RecivePage() {
   const navigate = useNavigate();

   let context = useContext(AuthContext);

   const [stateServer, dispachServer] = React.useReducer(
      stateServerReduser,
      requestInitialState
   );

   const initState: InitialState = {
      SUMM: null,
      errors: { SUMM: "" },
   };

   const initializer = (state: InitialState): State => ({
      ...state,
      SUMM: null,
      errors: { SUMM: "" },
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
      let error: string | undefined = reciveForm.validate(
         e.target.name,
         e.target.value
      );
      // console.log(error);
      if (e.target.name === "SUMM") {
         dispach({
            type: ACTION_TYPE.CHANGE_SUMM,
            payload: e.target.value,
            error: error,
         });
      }
   };
   const convertData = (data: {
      id: number;
      type: string;
      target: string;
      summ: number;
   }) => {
      return JSON.stringify({
         token: context.userState.token,
         id: data.id,
         type: data.type,
         target: data.target,
         summ: data.summ,
      });
   };

   const sendDtata = async (dataToSend: {
      id: number;
      type: string;
      target: string;
      summ: number;
   }) => {
      dispachServer({ type: REQUEST_ACTION_TYPE.PROGRESS });

      try {
         const res = await fetch("http://localhost:4000/recive", {
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
            navigate(`/balance`, { replace: true });
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

   const handleClickRecive = (target: string) => () => {
      const summ = state.SUMM;
      if (summ !== null && summ > 0) {
         sendDtata({
            id: context.userState.user.id,
            type: TRANSACTION_TYPE.RECEIVE,
            target: target,
            summ: summ,
         });
      }
   };

   React.useEffect(() => {
      reciveForm.validateAll();
      reciveForm.checkDisabled();
   }, [state]);

   return (
      <section className="recive-page">
         <BackBtn title="Receive" />
         <div className="recive-form">
            <div className="grid">
               <div className="form__title">Receive amount</div>
               <div className="form__item">
                  <Field
                     action={handleInput}
                     label=""
                     type="number"
                     name="SUMM"
                     error={state.errors.SUMM}
                     id={"field-0014"}
                  />
               </div>
            </div>
            <div className="divider"></div>
            <div className="grid">
               <div className="form__title">Payment system</div>
               <div className="send-btn" onClick={handleClickRecive("Stripe")}>
                  <div className="flex">
                     <img
                        width={18}
                        height={18}
                        src="/svg/stripe.svg"
                        alt="stripe"
                        className="payment-main-logo"
                     ></img>
                     <span className="payment-title">Stripe</span>
                  </div>
                  <div className="payment-logos">
                     <img src="/payment_logos/mc.png" alt="" />
                     <img src="/payment_logos/eter.png" alt="" />
                     <img src="/payment_logos/btc.png" alt="" />
                     <img src="/payment_logos/red.png" alt="" />
                     <img src="/payment_logos/blue.png" alt="" />
                     <img src="/payment_logos/binance.png" alt="" />
                  </div>
               </div>
               <div
                  className="send-btn"
                  onClick={handleClickRecive("Coinbase")}
               >
                  <div className="flex">
                     <img
                        width={18}
                        height={18}
                        src="/svg/coinbase.svg"
                        alt="coinbase"
                        className="payment-main-logo"
                     ></img>
                     <span className="payment-title">Coinbase</span>
                  </div>
                  <div className="payment-logos">
                     <img src="/payment_logos/eter.png" alt="" />
                     <img src="/payment_logos/mc.png" alt="" />
                     <img src="/payment_logos/red.png" alt="" />
                     <img src="/payment_logos/btc.png" alt="" />
                     <img src="/payment_logos/binance.png" alt="" />
                     <img src="/payment_logos/blue.png" alt="" />
                  </div>
               </div>
            </div>
         </div>

         {stateServer.status === REQUEST_ACTION_TYPE.PROGRESS && <Loader />}
      </section>
   );
}
