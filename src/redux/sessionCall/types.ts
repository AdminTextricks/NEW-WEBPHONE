// types.ts
export const CallsHistoryActionTypes = {
  GET_CALLS_HISTORY: "GET_CALLS_HISTORY",
};

export const IsCallingActionTypes = {
  IS_CALLING: "IS_CALLING",
};

export const START_TIMER = "START_TIMER";
export const STOP_TIMER = "STOP_TIMER";
export const UPDATE_TIMER = "UPDATE_TIMER";
export const HANDLE_CALL_CLICKED = "HANDLE_CALL_CLICKED";

export const RuningCallingActionTypes = {
  CURRENT_CALLERS: "CURRENT_CALLERS",
  QUEUE_CALLERS: "CURRENT_CALLERS",
};

export interface Call {
  id: string;
  direction?: string;
  number?: string;
  startTime?: string;
  endTime?: string;
  status: string;
}
