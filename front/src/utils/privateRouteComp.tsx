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

const checkAuth = async (user: User) => {
   const convertData = (data: User) => {
      return JSON.stringify({
         token: user.token,
         user: {
            email: user.user.email,
            isConfirm: user.user.isConfirm,
            id: user.user.id,
         },
      });
   };
   try {
      const res = await fetch("http://localhost:4000/auth-confirm", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: convertData(user),
      });

      const data = await res.json();

      if (res.ok) {
         return true;
      } else {
         console.log(data.message, "error");
         return false;
      }
   } catch (error) {
      const message = "Не можливо підключитись";

      console.log(message);

      return false;
   }
};

const PrivateRoute = ({ children }: JSX.ElementType | any) => {
   const user = useContext(AuthContext);
   const [res, setRes] = useState(false);
   const user1: User = user.userState;
   // let res = await checkAuth(user1);

   user1.token ? setRes(true) : setRes(false);

   console.log(res, user1.token);

   if (
      res &&
      user1.token &&
      !user1.user.isConfirm &&
      window.location.pathname === "/signup-confirm"
   ) {
      console.log("Render Children signup-confirm element");
      return <>{children}</>;
   }
   if (
      res &&
      user1.token &&
      !user1.user.isConfirm &&
      window.location.pathname !== "/signup-confirm"
   ) {
      console.log("Navigate signup-confirm");
      return <Navigate to="/signup-confirm" replace />;
   }
   if (res && user1.token && user1.user.isConfirm) {
      console.log("Render Children element");
      return <>{children}</>;
   } else {
      return <Navigate to="/" replace />;
   }
};
export default PrivateRoute;
