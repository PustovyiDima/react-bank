import { useCallback, useContext, createElement } from "react";
import { AuthContext } from "../App";
import { Navigate, Outlet, useNavigate } from "react-router-dom";

const PrivateRoute = ({ children }: any) => {
   const navigate = useNavigate();
   const user = useContext(AuthContext);
   console.log("private", user);
   console.log(window.location.pathname);

   if (
      user.userState.token &&
      !user.userState.user.isConfirm &&
      window.location.pathname === "/signup-confirm"
   ) {
      console.log("Render Children signup-confirm element");
      return <>{children}</>;
   }
   if (user.userState.token && !user.userState.user.isConfirm) {
      console.log("Navigate signup-confirm");
      return <Navigate to="/signup-confirm" />;
   }
   if (user.userState.token && user.userState.user.isConfirm) {
      console.log("Render Children element");
      return <>{children}</>;
   } else {
      console.log("Navigate welcome");
      return <Navigate to="/" />;
   }
};
export default PrivateRoute;
