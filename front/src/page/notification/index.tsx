import "./index.css";
import React, {
   Fragment,
   useCallback,
   useContext,
   useEffect,
   useReducer,
} from "react";
import BackBtn from "../../component/back-button";
import { AuthContext, InitialState } from "../../App";
import {
   REQUEST_ACTION_TYPE,
   requestInitialState,
   stateServerReduser,
} from "../../utils/serverReducer";
import { Loader } from "../../component/sceleton";
import Alert from "../../component/alert";
const NOTIFIC_TYPE = {
   WARNING: "WARNING",
   INFO: "INFO",
};

const DateResive = (timestamp: number) => {
   const date1: number = timestamp;
   const dateNow: number = new Date().getTime();
   const diff: number = dateNow - date1;
   const seconds = diff / 1000;
   const minutes = seconds / 60;
   const hours = minutes / 60;
   const days = hours / 24;

   if (minutes >= 1) {
      if (hours >= 1) {
         if (days >= 1) {
            return <>{Math.round(days)} days ago</>;
         }
         return <>{Math.round(hours)} hour ago</>;
      }
      return <>{Math.round(minutes)} min. ago</>;
   }
   return <>{Math.round(seconds)} sec. ago</>;
};

export default function NotificationsPage() {
   const context = useContext(AuthContext);
   const user: InitialState = context.userState;

   const userId = user.user.id;

   const [state, dispach] = useReducer(stateServerReduser, requestInitialState);

   const convertSendData = (userId: number) => {
      return JSON.stringify({
         userId: userId,
         token: user.token,
      });
   };

   const getData = useCallback(async (userId: number) => {
      dispach({ type: REQUEST_ACTION_TYPE.PROGRESS });

      try {
         const res = await fetch(
            "http://localhost:4000/get-user-notification",
            {
               method: "POST",
               headers: {
                  "Content-Type": "application/json",
               },
               body: convertSendData(userId),
            }
         );

         const data = await res.json();
         // console.log(data);

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
      isEmpty: data.list.length === 0,
   });

   useEffect(() => {
      if (userId) {
         getData(userId);
      }
   }, []);

   return (
      <section className="page">
         <BackBtn title="Notifications" />

         <div className="notification-list">
            {state.status === REQUEST_ACTION_TYPE.SUCCESS && (
               <Fragment>
                  {state.data.isEmpty ? (
                     <Alert message="Список повідомлень пустий" />
                  ) : (
                     state.data.list.map(
                        (item: {
                           id: number;
                           type: string;
                           text: string;
                           date: number;
                        }) => (
                           <Fragment key={item.id}>
                              <div className="notification-item">
                                 <div className="notification-item__logo">
                                    {item.type === NOTIFIC_TYPE.WARNING && (
                                       <img
                                          src="/svg/Danger.svg"
                                          alt="warning"
                                          width={20}
                                          height={20}
                                       />
                                    )}
                                    {item.type === NOTIFIC_TYPE.INFO && (
                                       <img
                                          src="/svg/bellnotific.svg"
                                          alt="info"
                                          width={20}
                                          height={20}
                                       />
                                    )}
                                 </div>
                                 <div className="notification-item__hero">
                                    <p className="notification-item__title">
                                       {item.text}
                                    </p>
                                    <p className="notification-item__info">
                                       <span>{DateResive(item.date)}</span>
                                       {item.type === NOTIFIC_TYPE.WARNING && (
                                          <span>{item.type}</span>
                                       )}
                                       {item.type === NOTIFIC_TYPE.INFO && (
                                          <span>Announcement</span>
                                       )}
                                    </p>
                                 </div>
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
