import {
  Call,
  CallsHistoryActionTypes,
  HANDLE_CALL_CLICKED,
  HANDLE_CALL_CONFERENCE_CLICKED,
  HANDLE_CALL_TRANSFER_CLICKED,
  HANDLE_CHANGE_DTMF_NUMBER,
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

export const handleChangeDtmfNumber = (data: any) => {
  return {
    type: HANDLE_CHANGE_DTMF_NUMBER,
    payload: data,
  };
};

export const handleCallConferenceClicked = (data: any) => {
  return {
    type: HANDLE_CALL_CONFERENCE_CLICKED,
    payload: data,
  };
};

export const handleCallTransferClicked = (data: any) => {
  return {
    type: HANDLE_CALL_TRANSFER_CLICKED,
    payload: data,
  };
};

export const setWaitBtnClicked = (btn: boolean) => ({
  type: IsCallBtnActionTypes.IS_WAITING,
  payload: btn,
});
