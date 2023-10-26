import {
   useCallback,
   useContext,
   createElement,
   useEffect,
   useState,
   useReducer,
} from "react";
import { AuthContext } from "../App";
import { Navigate } from "react-router-dom";

type User = {
   token: string;
   user: {
      email: string;
      isConfirm: boolean;
      id: number;
   };
};

const PrivateRoute = ({ children }: JSX.ElementType | any) => {
   const user = useContext(AuthContext);
   const user1: User = user.userState;

   const token = user1.token;

   useEffect(() => {
      if (token) {
         sendRequest(token, user1.user.email);
      } else {
         console.log("null");
         // user.authDisp("LOGOUT");
      }
   }, []);

   const convertData = (token: string, email: string) => {
      return JSON.stringify({
         token: token,
         email: email,
      });
   };

   const sendRequest = async (token: string, email: string) => {
      try {
         const res = await fetch("http://localhost:4000/auth-confirm", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: convertData(token, email),
         });

         const data = await res.json();

         if (res.ok) {
            console.log("ok");
            return true;
         } else {
            console.log(data.message, "error");
            user.authDisp("LOGOUT");
         }
      } catch (error) {
         const message = "Не можливо підключитись";

         console.log(message);

         user.authDisp("LOGOUT");
      }
   };

   if (
      user1.token &&
      !user1.user.isConfirm &&
      window.location.pathname === "/signup-confirm"
   ) {
      console.log("Render Children signup-confirm element");
      return <>{children}</>;
   }
   if (
      user1.token &&
      !user1.user.isConfirm &&
      window.location.pathname !== "/signup-confirm"
   ) {
      console.log("Navigate signup-confirm");
      return <Navigate to="/signup-confirm" replace />;
   }
   if (user1.token && user1.user.isConfirm) {
      console.log("Render Children element");
      return <>{children}</>;
   } else {
      console.log("Render Children element");
      return <Navigate to="/" replace />;
   }
};
export default PrivateRoute;
