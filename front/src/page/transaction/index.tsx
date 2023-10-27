import "./index.css";
import { AuthContext, InitialState } from "../../App";
import React, { useCallback, useContext, useEffect, useReducer } from "react";
import Button from "../../component/button";
import { useNavigate, useParams } from "react-router-dom";
import BackBtn from "../../component/back-button";
import { Sceleton, Loader } from "../../component/sceleton";
import {
   stateServerReduser,
   requestInitialState,
   REQUEST_ACTION_TYPE,
} from "../../utils/serverReducer";
import Alert from "../../component/alert";

const TRANSACTION_TYPE = {
   SEND: "send",
   RECEIVE: "receive",
};

const dateResive = (timestamp: number) => {
   const date = new Date(timestamp);
   const hours = date.getHours();
   const minutes = date.getMinutes();
   const day = date.getDate();
   const monthNumber = date.getMonth() + 1;
   let monthName: string;
   switch (monthNumber) {
      case 1:
         monthName = "Jan.";
         break;
      case 2:
         monthName = "Feb.";
         break;
      case 3:
         monthName = "Mar.";
         break;
      case 4:
         monthName = "Apr.";
         break;
      case 5:
         monthName = "May.";
         break;
      case 6:
         monthName = "Jun.";
         break;
      case 7:
         monthName = "Jul.";
         break;
      case 8:
         monthName = "Aug.";
         break;
      case 9:
         monthName = "Sep.";
         break;
      case 10:
         monthName = "Oct.";
         break;
      case 11:
         monthName = "Nov.";
         break;
      case 12:
         monthName = "Dec";
         break;
      default:
         monthName = "NAN";
         break;
   }
   const hour = hours < 10 ? `0` + hours : hours;
   const minut = minutes < 10 ? `0` + minutes : minutes;
   return (
      <>
         {day} {monthName}, {hour}:{minut}
      </>
   );
};

export default function TransactionPage() {
   const navigate = useNavigate();
   let { transactionId } = useParams();
   const id = Number(transactionId?.slice(1));
   const context = useContext(AuthContext);
   const user: InitialState = context.userState;
   const token = user.token;

   const userId = user.user.id;

   const [state, dispach] = useReducer(stateServerReduser, requestInitialState);

   const convertSendData = (data: {
      token: string;
      userId: number;
      transactionId: number;
   }) => {
      return JSON.stringify({
         token: data.token,
         userId: data.userId,
         transactionId: data.transactionId,
      });
   };

   const getData = async (dataToSend: {
      token: string;
      userId: number;
      transactionId: number;
   }) => {
      dispach({ type: REQUEST_ACTION_TYPE.PROGRESS });

      try {
         const res = await fetch("http://localhost:4000/get-transaction-data", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: convertSendData(dataToSend),
         });
         const data = await res.json();

         if (res.ok) {
            // console.log(data);
            dispach({
               type: REQUEST_ACTION_TYPE.SUCCESS,
               payload: convertData(data),
            });
         } else {
            dispach({
               type: REQUEST_ACTION_TYPE.ERROR,
               message: data.message,
            });
         }

         // ===
      } catch (error) {
         const message = "Не можливо підключитись";
         dispach({
            type: REQUEST_ACTION_TYPE.ERROR,
            message: message,
         });
      }
   };

   const convertData = (transactionData: {
      transaction: {
         date: number;
         id: number;
         userid: number;
         type: string;
         target: string;
         summ: number;
      };
   }) => ({
      date: transactionData.transaction.date,
      id: transactionData.transaction.id,
      type: transactionData.transaction.type,
      target: transactionData.transaction.target,
      summ: transactionData.transaction.summ,
   });

   useEffect(() => {
      if (userId && id && token) {
         getData({ token: token, userId: userId, transactionId: id });
      }
   }, []);

   return (
      <section className="transaction-page">
         <BackBtn title="Transaction" />
         <div className="transaction-item">
            {state.status === REQUEST_ACTION_TYPE.SUCCESS &&
               state.data.type === TRANSACTION_TYPE.RECEIVE && (
                  <div className="transaction-item__summ transaction-item__summ__recive">
                     +${state.data.summ}
                  </div>
               )}
            {state.status === REQUEST_ACTION_TYPE.SUCCESS &&
               state.data.type === TRANSACTION_TYPE.SEND && (
                  <div className="transaction-item__summ transaction-item__summ__send">
                     -${state.data.summ}
                  </div>
               )}
            {state.status === REQUEST_ACTION_TYPE.SUCCESS && (
               <div className="transaction-item__info">
                  <span>Date</span>
                  <span>{dateResive(state.data.date)}</span>
               </div>
            )}
            {state.status === REQUEST_ACTION_TYPE.SUCCESS && (
               <div className="transaction-item__info">
                  <span>Address</span>
                  <span>{state.data.target}</span>
               </div>
            )}
            {state.status === REQUEST_ACTION_TYPE.SUCCESS && (
               <div className="transaction-item__info">
                  <span>Type</span>
                  <span style={{ textTransform: "capitalize" }}>
                     {state.data.type}
                  </span>
               </div>
            )}
         </div>

         {state.status === REQUEST_ACTION_TYPE.PROGRESS && <Loader />}
      </section>
   );
}
