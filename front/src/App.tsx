import {
   useReducer,
   createContext,
   useContext,
   createElement,
   useCallback,
   useMemo,
   useEffect,
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
import SignupConfirmPage from "./container/signup-confirm";
import SignInPage from "./container/signin";
import SignInConfirmPage from "./container/signUp";
import BalancePage from "./page/balance";
import RecoveryPage from "./container/recovery";
import RecoveryConfirmPage from "./container/recovery-confirm";
import AuthRoute from "./utils/authRouteComp";
import PrivateRoute from "./utils/privateRouteComp";
import { SESSION_KEY, getSession, getTokenSession } from "./utils/session";

import "./App.css";
import { render } from "@testing-library/react";

type InitialState = {
   token: undefined;
   user: {
      email: undefined;
      isConfirm: false;
      id: undefined;
   };
};

type State = {
   token: string | undefined;
   user: {
      email: string | undefined;
      isConfirm: boolean;
      id: number | undefined;
   };
};

type Action = {
   type: ACTION_TYPE;
   payload?: any;
};

enum ACTION_TYPE {
   LOGIN = "LOGIN",
   LOGOUT = "LOGOUT",
}

const stateReducer: React.Reducer<State, Action> = (
   state: State,
   action: Action
): State => {
   switch (action.type) {
      case ACTION_TYPE.LOGIN:
         const token = action.payload.token;
         const user = action.payload.user;
         console.log("logIn", action.payload);
         return { ...state, token: token, user: user };
      case ACTION_TYPE.LOGOUT:
         window.localStorage.removeItem(SESSION_KEY);
         return {
            ...state,
            token: undefined,
            user: {
               email: undefined,
               isConfirm: false,
               id: undefined,
            },
         };
      default:
         return { ...state };
   }
};
const initState: any = {
   token: undefined,
   user: {
      email: undefined,
      isConfirm: false,
      id: undefined,
   },
};
export const AuthContext = createContext(initState);

// =========================================================================
function App() {
   const session = getSession();

   const initState: InitialState = {
      token: undefined,
      user: {
         email: undefined,
         isConfirm: false,
         id: undefined,
      },
   };
   const initializer = (state: InitialState): State => {
      return {
         ...state,
         token: undefined,
         user: {
            email: undefined,
            isConfirm: false,
            id: undefined,
         },
      };
   };

   const [userState, dispach] = useReducer(
      stateReducer,
      initState,
      initializer
   );

   const authDisp = useCallback(
      (type: string, session?: InitialState) => {
         console.log(type, type === ACTION_TYPE.LOGIN);
         if (type === ACTION_TYPE.LOGIN) {
            dispach({ type: ACTION_TYPE.LOGIN, payload: session });
         }
         if (type === ACTION_TYPE.LOGOUT) {
            dispach({ type: ACTION_TYPE.LOGOUT });
         }
      },
      [userState]
   );

   const authContextData = {
      userState: userState,
      authDisp: authDisp,
   };
   const token = null;
   console.log(session);
   if (session !== null) {
      const token = session.token;
   }

   useEffect(() => {
      if (token && token != null) {
         sendRequest(token, session.user.email);
      }
   }, []);

   const convertData = (token: string, email: string) => {
      return JSON.stringify({
         token: token,
         email: email,
      });
   };

   const sendRequest = async (token: string, email: string) => {
      try {
         const res = await fetch("http://localhost:4000/auth-confirm", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: convertData(token, email),
         });

         const data = await res.json();

         if (res.ok) {
            return true;
         } else {
            console.log(data.message, "error");
            authDisp("LOGOUT");
         }
      } catch (error) {
         const message = "Не можливо підключитись";

         console.log(message);

         authDisp("LOGOUT");
      }
   };

   return (
      <AuthContext.Provider value={authContextData}>
         <BrowserRouter>
            <Routes>
               <Route
                  index
                  path="/"
                  element={
                     <AuthRoute>
                        <WelcomePage />
                     </AuthRoute>
                  }
               />
               <Route
                  path="/signup"
                  element={
                     <AuthRoute>
                        <SignupPage />
                     </AuthRoute>
                  }
               />
               <Route
                  path="/signup-confirm/*"
                  element={<PrivateRoute>{<SignupConfirmPage />}</PrivateRoute>}
               />
               <Route
                  path="/signin"
                  element={
                     <AuthRoute>
                        <SignInPage />
                     </AuthRoute>
                  }
               />
               <Route
                  path="/signin-confirm/*"
                  element={
                     <AuthRoute>
                        <SignInConfirmPage />
                     </AuthRoute>
                  }
               />
               <Route
                  path="/recovery"
                  element={
                     <AuthRoute>
                        <RecoveryPage />
                     </AuthRoute>
                  }
               />
               <Route
                  path="/recovery-confirm"
                  element={
                     <AuthRoute>
                        <RecoveryConfirmPage />
                     </AuthRoute>
                  }
               />
               <Route
                  path="/balance"
                  element={
                     <PrivateRoute>
                        <BalancePage />
                     </PrivateRoute>
                  }
               />
            </Routes>
         </BrowserRouter>
      </AuthContext.Provider>
   );
}

export default App;
