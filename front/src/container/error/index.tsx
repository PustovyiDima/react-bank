import { Link } from "react-router-dom";
import "./index.css";
import React from "react";

const ErrorPage: React.FC = () => {
   return (
      <section>
         <h1>404 Сторінка не знайдена</h1>
         <Link to={"/"}>На головну</Link>
      </section>
   );
};

export default ErrorPage;
