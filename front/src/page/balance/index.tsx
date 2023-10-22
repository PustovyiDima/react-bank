import { AuthContext } from "../../App";
import "./index.css";
import React, { useContext } from "react";

export default function Container() {
   const user = useContext(AuthContext);

   const handleLogout = () => {
      user.authDisp("LOGOUT");
   };

   return (
      <section className="welcome-page">
         <div>Balance</div>

         <button onClick={handleLogout}>Logout</button>
      </section>
   );
}
