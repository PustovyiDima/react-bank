import "./index.css";
import React from "react";
import Button from "../../component/button";
import { useNavigate } from "react-router-dom";
import BackBtn from "../../component/back-button";

export default function NotificationsPage() {
   const navigate = useNavigate();

   return (
      <section className="page">
         <BackBtn title="" />
      </section>
   );
}
