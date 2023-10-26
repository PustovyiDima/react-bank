import "./index.css";
import React from "react";
import Button from "../../component/button";
import Grid from "../../component/grid";
import { useNavigate } from "react-router-dom";

export default function Container() {
   const navigate = useNavigate();
   const handleMove = (to: string) => () => {
      navigate(to);
   };
   return (
      <section className="welcome-page">
         <div className="welcome-page__hero">
            <div style={{ padding: "50px 0" }}>
               <Grid gap={16} center>
                  <>
                     <h1 className="welcome-page__title">Hello!</h1>
                     <p className="welcome-page__info">Welcome to bank app</p>
                  </>
               </Grid>
            </div>
            <img className="mainImg" src="/money.png" alt="" />
         </div>
         <div className="wp__buttons">
            <Grid>
               <>
                  <Button onClick={handleMove("/signup")}>Sign Up</Button>
                  <Button onClick={handleMove("/signin")} outline>
                     Sign In
                  </Button>
               </>
            </Grid>
         </div>
      </section>
   );
}
