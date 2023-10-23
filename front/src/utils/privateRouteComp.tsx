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
