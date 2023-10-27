import { useContext, createElement, useEffect } from "react";
import { AuthContext } from "../App";
import { Navigate } from "react-router-dom";
import { getSession } from "./session";

const AuthRoute = ({ children }: any) => {
   const user = useContext(AuthContext);
   // console.log("auth", user);

   useEffect(() => {
      const session = getSession();
      // console.log(session);

      if (session) {
         // console.log("LOGIN", session);
         user.authDisp("LOGIN", session);
      } else {
         user.authDisp("LOGOUT");
      }
      // eslint-disable-next-line
   }, []);

   return user.userState.token ? (
      <>
         <Navigate to="/balance" replace />
      </>
   ) : (
      createElement(children.type)
   );
};

export default AuthRoute;
