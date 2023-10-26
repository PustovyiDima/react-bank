import {
   useReducer,
   createContext,
   useContext,
   createElement,
   useCallback,
   useMemo,
   useEffect,
   lazy,
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

import { SESSION_KEY, getSession } from "./utils/session";

import "./App.css";
import WelcomePage from "./page/welcome";
import SignupPage from "./page/signUp";
import SignupConfirmPage from "./page/signup-confirm";
import SignInPage from "./page/signin";
import BalancePage from "./page/balance";
import RecoveryPage from "./page/recovery";
import RecoveryConfirmPage from "./page/recovery-confirm";
import AuthRoute from "./utils/authRouteComp";
import PrivateRoute from "./utils/privateRouteComp";
import NotificationsPage from "./page/notification";
import SettingsPage from "./page/settings";
import RecivePage from "./page/receive";
import SendPage from "./page/send";
import TransactionPage from "./page/transaction";

export type InitialState = {
   token: string | undefined;
   user: {
      email: string | undefined;
      isConfirm: false;
      id: number | undefined;
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
         console.log("logout", action.payload);
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
   console.log("render");
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
               <Route
                  path="/notifications"
                  element={
                     <PrivateRoute>
                        <NotificationsPage />
                     </PrivateRoute>
                  }
               />
               <Route
                  path="/settings"
                  element={
                     <PrivateRoute>
                        <SettingsPage />
                     </PrivateRoute>
                  }
               />
               <Route
                  path="/recive"
                  element={
                     <PrivateRoute>
                        <RecivePage />
                     </PrivateRoute>
                  }
               />
               <Route
                  path="/send"
                  element={
                     <PrivateRoute>
                        <SendPage />
                     </PrivateRoute>
                  }
               />
               <Route
                  path="/transaction/:transactionId"
                  element={
                     <PrivateRoute>
                        <TransactionPage />
                     </PrivateRoute>
                  }
               />
            </Routes>
            {/* <Route path="*" Component={error} /> */}
         </BrowserRouter>
      </AuthContext.Provider>
   );
}

export default App;
