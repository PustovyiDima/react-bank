import { useCallback, useContext, createElement, useEffect } from "react";
import { AuthContext } from "../App";
import { Navigate, Outlet } from "react-router-dom";
import { getSession } from "./session";

const AuthRoute = ({ children }: any) => {
   const user = useContext(AuthContext);
   console.log("auth", user);

   useCallback(() => {
      const session = getSession();

      if (session) {
         console.log("LOGIN", session);
         user.authDisp("LOGIN", session);
      }
   }, [user.userState.token]);

   return user.userState.token ? (
      <>
         <Navigate to="/balance" replace />
      </>
   ) : (
      createElement(children.type)
   );
};

export default AuthRoute;
