
type StateServerStatus = {
    status: string | null;
    message?: string | null|undefined;
    data?: any | null;
 };
 
 type ActionStatus = {
    type: REQUEST_ACTION_TYPE;
    payload?: any;
    message?:string
 };

 export const requestInitialState = {
    status: null,
    message: "",
    data: null,
 };
 
 export enum REQUEST_ACTION_TYPE {
    PROGRESS = "progress",
    SUCCESS = "success",
    ERROR = "error",
    RESET = "reset",
 }

export const stateServerReduser: React.Reducer<StateServerStatus, ActionStatus> = (
    stateServer: StateServerStatus,
    action: ActionStatus
 ): StateServerStatus => {
    switch (action.type) {
       case REQUEST_ACTION_TYPE.PROGRESS:
          return {
             ...stateServer,
             status: action.type,
              message: "...",
             // data: null,
          };
 
       case REQUEST_ACTION_TYPE.SUCCESS:
          return {
             ...stateServer,
             status: action.type,
             data: action.payload,
             message:action.message
          };
       case REQUEST_ACTION_TYPE.ERROR:
          return {
             ...stateServer,
             status: action.type,
             message: action.message,
          };
       case REQUEST_ACTION_TYPE.RESET:
          return { ...requestInitialState };
       default:
          return { ...stateServer };
    }
 };