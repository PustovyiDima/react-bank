import { AuthContext, InitialState } from "../../App";
import "./index.css";
import React, {
   Fragment,
   useCallback,
   useContext,
   useEffect,
   useReducer,
} from "react";

import { Sceleton, Loader } from "../../component/sceleton";
import {
   stateServerReduser,
   requestInitialState,
   REQUEST_ACTION_TYPE,
} from "../../utils/serverReducer";
import Alert from "../../component/alert";
import { useNavigate } from "react-router-dom";

const TRANSACTION_TYPE = {
   SEND: "send",
   RECEIVE: "receive",
};

const DateResive = (timestamp: number) => {
   const date = new Date(timestamp);
   let hours = date.getHours();
   let minutes = date.getMinutes();
   const hour = hours < 10 ? `0` + hours : hours;
   const minut = minutes < 10 ? `0` + minutes : minutes;
   return (
      <>
         {hour}:{minut}
      </>
   );
};

export default function BalancePage() {
   const navigate = useNavigate();
   const context = useContext(AuthContext);
   const user: InitialState = context.userState;

   const userId = user.user.id;

   const [state, dispach] = useReducer(stateServerReduser, requestInitialState);

   const getData = useCallback(async (userId: number) => {
      dispach({ type: REQUEST_ACTION_TYPE.PROGRESS });

      try {
         const res = await fetch(
            `http://localhost:4000/get-user?userId=${userId}`,
            {
               method: "GET",
            }
         );

         const data = await res.json();

         if (res.ok) {
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
   }, []);

   const convertData = (data: { list: any[]; balance: number }) => ({
      list: data.list.reverse(),
      balance: data.balance,
      isEmpty: data.list.length === 0,
   });

   useEffect(() => {
      if (userId) {
         // console.log("1");
         getData(userId);
      }
   }, []);
   console.log(state.data);

   return (
      <section className="balance-page">
         <div className="card">
            <div className="balance-page__header">
               <button onClick={() => navigate("/settings")}>
                  <img
                     width={24}
                     height={24}
                     src="/svg/setings.svg"
                     alt="settings"
                  />
               </button>
               <p className="balance-page__header__tittle">Main wallet</p>
               <button onClick={() => navigate("/notifications")}>
                  <img
                     width={24}
                     height={24}
                     src="/svg/bell-ringing.svg"
                     alt="notification"
                  />
               </button>
            </div>
            {state.status === REQUEST_ACTION_TYPE.PROGRESS && (
               <div style={{ height: "34px", width: " 100px", margin: "auto" }}>
                  <Sceleton />
               </div>
            )}
            {state.status === REQUEST_ACTION_TYPE.SUCCESS && (
               <div className="balance">$ {state.data.balance}</div>
            )}
            <div className="buttons">
               <button
                  onClick={() => navigate("/recive")}
                  className="balance__button"
               >
                  <img
                     width={24}
                     height={24}
                     src="/svg/arrow-down-right.svg"
                     alt="recive"
                  />
               </button>
               <button
                  onClick={() => navigate("/send")}
                  className="balance__button"
               >
                  <img
                     width={24}
                     height={24}
                     src="/svg/people-upload.svg"
                     alt="send"
                  />
               </button>
            </div>
         </div>

         <div className="transactions-list">
            {state.status === REQUEST_ACTION_TYPE.PROGRESS && (
               <div style={{ display: "grid", gap: "40px", marginTop: "20px" }}>
                  <div style={{ height: "48px" }}>
                     <Sceleton />
                  </div>
                  <div style={{ height: "48px" }}>
                     <Sceleton />
                  </div>
                  <div style={{ height: "48px" }}>
                     <Sceleton />
                  </div>
               </div>
            )}

            {state.status === REQUEST_ACTION_TYPE.SUCCESS && (
               <Fragment>
                  {state.data.isEmpty ? (
                     <Alert message="Список транзакцій пустий" />
                  ) : (
                     state.data.list.map(
                        (item: {
                           date: number;
                           id: number;
                           userid: number;
                           type: string;
                           target: string;
                           summ: number;
                        }) => (
                           <Fragment key={item.id}>
                              <div
                                 className={`transaction-list-item `}
                                 onClick={() => {
                                    navigate(`/transaction/:${item.id}`);
                                 }}
                              >
                                 <div
                                    style={{
                                       display: "flex",
                                       gap: "12px",
                                       alignItems: "center",
                                    }}
                                 >
                                    <div className="transaction-list-item__logo">
                                       {item.target === "coinbase" && (
                                          <img
                                             width={18}
                                             height={18}
                                             src="/svg/coinbase.svg"
                                             alt="coinbase"
                                          ></img>
                                       )}
                                       {item.target === "stripe" && (
                                          <img
                                             width={18}
                                             height={18}
                                             src="/svg/stripe.svg"
                                             alt="stripe"
                                          ></img>
                                       )}
                                       {item.target !== "coinbase" &&
                                          item.target !== "stripe" && (
                                             <img
                                                width={18}
                                                height={18}
                                                src="/svg/user.svg"
                                                alt="user"
                                             ></img>
                                          )}
                                    </div>
                                    <div className="transaction-list-item__hero">
                                       <p className="transaction-list-item__title">
                                          {item.target}
                                       </p>
                                       <p className="transaction-list-item__info">
                                          <span>{DateResive(item.date)}</span>
                                          {item.type ===
                                             TRANSACTION_TYPE.RECEIVE && (
                                             <span>Receipt</span>
                                          )}
                                          {item.type ===
                                             TRANSACTION_TYPE.SEND && (
                                             <span>Sending</span>
                                          )}
                                       </p>
                                    </div>
                                 </div>
                                 {item.type === TRANSACTION_TYPE.RECEIVE && (
                                    <div
                                       className={`transaction__summ  transaction__summ--recive }`}
                                    >
                                       +${item.summ}
                                    </div>
                                 )}
                                 {item.type === TRANSACTION_TYPE.SEND && (
                                    <div
                                       className={`transaction__summ  transaction__summ--send }`}
                                    >
                                       -${item.summ}
                                    </div>
                                 )}
                              </div>
                           </Fragment>
                        )
                     )
                  )}
               </Fragment>
            )}
         </div>
         {state.status === REQUEST_ACTION_TYPE.PROGRESS && <Loader />}
      </section>
   );
}
