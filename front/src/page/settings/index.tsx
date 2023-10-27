import "./index.css";
import { AuthContext } from "../../App";
import React, { useContext } from "react";

import BackBtn from "../../component/back-button";

import ChangeEmail from "../../container/changeEmailForm";
import ChangePassword from "../../container/changePasswordForm";
import Button from "../../component/button";

export default function SettingsPage() {
   const context = useContext(AuthContext);
   // const user: InitialState = context.userState;

   const handleLogout = () => {
      context.authDisp("LOGOUT");
   };

   return (
      <section className="page">
         <BackBtn title="Settings" />
         <ChangeEmail />
         <ChangePassword />
         <div className="form">
            <Button onClick={handleLogout} danger>
               Log out
            </Button>
         </div>
      </section>
   );
}
