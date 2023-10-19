import "./index.css";
import React from "react";

import Grid from "../../component/grid";
import BackBtn from "../../component/back-button";
import Field from "../../component/field";
import FieldPassword from "../../component/field-password";
import Title from "../../component/title";
import Button from "../../component/button";

import Form from "../../utils/form";
import { REG_EXP_EMAIL, REG_EXP_PASSWORD } from "../../utils/form";

export default function Container() {
   return (
      <section className="form-section">
         <div style={{ padding: "10px 20px 22px" }}>
            <BackBtn />
         </div>

         <div style={{ display: "grid", gap: "32px" }}>
            <Title
               title={"Sign up"}
               text={"Choose a registration method"}
            ></Title>

            <div className="form">
               <div className="form__item">
                  <Field
                     action="loginForm.change"
                     label="Email"
                     type="email"
                     name="email"
                     placeholder="yourmail@mail.com"
                  />
                  {/* <span name="email" class="form__error">
                     Помилка
                  </span> */}
               </div>
               <div className="form__item">
                  <FieldPassword
                     action="loginForm.change"
                     label="Password"
                     type="password"
                     name="password"
                  />
                  {/* <span name="password" class="form__error">
                     Помилка
                  </span> */}
               </div>
            </div>
         </div>
      </section>
   );
}
