import {
   useReducer,
   useEffect,
   useCallback,
   useContext,
   createContext,
   useState,
} from "react";
import {
   BrowserRouter,
   Routes,
   Route,
   useParams,
   Link,
   useNavigate,
   Navigate,
} from "react-router-dom";
import WelcomePage from "./container/welcome";
import SignupPage from "./container/signUp";

import "./App.css";

// type ContextType = {
//    token: number;
//    user: { id: number; isLogged: boolean } | null;
// };

// const AuthContext = createContext<ContextType | null>(null);

// type State = {
//    isLogged: boolean;
// };

// type Action = {
//    type: ACTION_TYPE;
// };

// enum ACTION_TYPE {
//    LOGIN = "LOGIN",
//    LOGOUT = "LOGOUT",
// }

// function login(state: State, action: Action): boolean {
//    switch (action.type) {
//       case ACTION_TYPE.LOGIN:
//          return true;
//       case ACTION_TYPE.LOGOUT:
//          return false;

//       default:
//          return false;
//    }
// }

function App() {
   //  const [isLogged, dispach] = useReducer(login, false);

   const authContextData = {};
   return (
      // <AuthContext.Provider>
      <BrowserRouter>
         <Routes>
            <Route
               index
               element={
                  //  <AuthRoute>
                  <WelcomePage />
                  //  </AuthRoute>
               }
            />
            <Route
               path="/signup"
               element={
                  // <AuthRoute>
                  <SignupPage />
                  // </AuthRoute>
               }
            />
         </Routes>
      </BrowserRouter>
      // </AuthContext.Provider>
   );
}

export default App;
