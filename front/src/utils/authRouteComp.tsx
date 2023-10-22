import { useCallback, useContext, createElement, useEffect } from "react";
import { AuthContext } from "../App";
import { Navigate, Outlet } from "react-router-dom";
import { getSession } from "./session";

const AuthRoute = ({ children }: any) => {
   const user = useContext(AuthContext);
   console.log("auth", user);

   const session = getSession();
   if (session) {
      //   console.log(session);
      user.authDisp("LOGIN", session);
   }

   return user.userState.token ? (
      <Navigate to="/balance" />
   ) : (
      createElement(children.type)
   );
};
export default AuthRoute;
