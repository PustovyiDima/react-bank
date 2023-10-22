
type StateServerStatus = {
    status: string | null;
    message: string | null;
    data: {} | null;
 };
 
 type ActionStatus = {
    type: REQUEST_ACTION_TYPE;
    payload?: any;
 };
 export const requestInitialState = {
    status: null,
    message: null,
    data: null,
 };
 
 export enum REQUEST_ACTION_TYPE {
    PROGRESS = "progress",
    SUCCESS = "success",
    ERROR = "error",
    RESET = "reset",
 }

export const stateSaerverReduser: React.Reducer<StateServerStatus, ActionStatus> = (
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
             message: action.payload,
          };
       case REQUEST_ACTION_TYPE.ERROR:
          return {
             ...stateServer,
             status: action.type,
             message: action.payload,
          };
       case REQUEST_ACTION_TYPE.RESET:
          return { ...requestInitialState };
       default:
          return { ...stateServer };
    }
 };