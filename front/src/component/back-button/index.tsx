import "./index.css";
import React from "react";
import { useNavigate } from "react-router-dom";

const BackBtn = () => {
   const navigate = useNavigate();
   const handleClick = () => navigate(-1);
   return (
      <div
         onClick={handleClick}
         className="backBtn"
         style={{ cursor: "pointer" }}
      >
         <img
            src="/svg/arrow-back-outline 1.svg"
            alt="<"
            width="24"
            height="24"
         />
      </div>
   );
};

export default BackBtn;