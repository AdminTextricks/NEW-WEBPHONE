import {
  Call,
  CallsHistoryActionTypes,
  HANDLE_CALL_CLICKED,
  IsCallBtnActionTypes,
  IsCallingActionTypes,
  START_TIMER,
  STOP_TIMER,
  UPDATE_TIMER,
} from "./types";

// actions.ts

export const setCallsHistory = (callHistory: Call) => ({
  type: CallsHistoryActionTypes.GET_CALLS_HISTORY,
  payload: Array.isArray(callHistory) ? callHistory : [callHistory],
});

export const setIsCalling = (getCallsLoading: boolean) => ({
  type: IsCallingActionTypes.IS_CALLING,
  payload: getCallsLoading,
});

export const startTimer = () => ({
  type: START_TIMER,
});

export const stopTimer = () => ({
  type: STOP_TIMER,
});

export const updateTimer = (elapsedTime: any) => ({
  type: UPDATE_TIMER,
  payload: elapsedTime,
});

export const handleCallClicked = (data: any) => {
  return {
    type: HANDLE_CALL_CLICKED,
    payload: data,
  };
};

export const setWaitBtnClicked = (btn: boolean) => ({
  type: IsCallBtnActionTypes.IS_WAITING,
  payload: btn,
});

export const setConfernceBtnClicked = (btn: boolean) => ({
  type: IsCallBtnActionTypes.IS_CONFERENCE,
  payload: btn,
});
