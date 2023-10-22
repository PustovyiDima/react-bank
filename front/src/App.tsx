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

// const AuthRoute = ({ children }: any) => {
//    const user = useContext(AuthContext);
//    console.log("auth", user);

//    return user.userState.token ? (
//       <Navigate to="/balance" />
//    ) : (
//       createElement(children.type)
//    );
// };

// const PrivateRoute = ({ children }: any) => {
//    const user = useContext(AuthContext);
//    console.log("private", user);
//    console.log(window.location.pathname);

//    // if (user.userState.token && !user.userState.user.isConfirm) {
//    //    return <Navigate to="/signup-confirm" replace />;
//    // }
//    if (user.userState.token && user.userState.user.isConfirm) {
//       return <>{children}</>;
//    } else {
//       return <Navigate to="/" />;
//    }
// };

function App() {
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

   const authDisp = useCallback((type: string, session?: InitialState) => {
      console.log(type, type === ACTION_TYPE.LOGIN);
      if (type === ACTION_TYPE.LOGIN) {
         dispach({ type: ACTION_TYPE.LOGIN, payload: session });
      }
      if (type === ACTION_TYPE.LOGOUT) {
         dispach({ type: ACTION_TYPE.LOGOUT });
      }
   }, []);

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
                  element={
                     <PrivateRoute>
                        <SignupConfirmPage />
                     </PrivateRoute>
                  }
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
