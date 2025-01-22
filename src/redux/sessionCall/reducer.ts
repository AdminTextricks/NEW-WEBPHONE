// reducer.ts
import {
  Call,
  CallsHistoryActionTypes,
  HANDLE_CALL_CLICKED,
  IsCallingActionTypes,
  IsCallBtnActionTypes,
  START_TIMER,
  STOP_TIMER,
  UPDATE_TIMER,
  HANDLE_CALL_CONFERENCE_CLICKED,
  HANDLE_CHANGE_DTMF_NUMBER,
  HANDLE_CALL_TRANSFER_CLICKED,
} from "./types";

interface SessionCallState {
  call_list: Call[];
  getCallsLoading: Boolean;
  current_callers: Call[];
  queue_callers: Call[];
  elapsedTime: any;
  callData: {};
  isCallWaiting: Boolean;
  dtmfSequence: any;
  blindNumber: any;
}

const initialState: SessionCallState = {
  call_list: [],
  getCallsLoading: false,
  current_callers: [],
  queue_callers: [],
  elapsedTime: 0,
  callData: {},
  isCallWaiting: false,
  dtmfSequence: null,
  blindNumber: null,
};

export const SessionCallReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case CallsHistoryActionTypes.GET_CALLS_HISTORY:
      return {
        ...state,
        call_list: state.call_list.some(
          call => call.id === action.payload[0].id,
        )
          ? state.call_list.map(call =>
              call.id === action.payload[0].id
                ? { ...call, ...action.payload[0] }
                : call,
            )
          : [action.payload[0], ...state.call_list], // Add new entry if ID not found
      };
    case IsCallingActionTypes.IS_CALLING:
      return { ...state, getCallsLoading: action.payload };
    case IsCallBtnActionTypes.IS_WAITING:
      return { ...state, isCallWaiting: action.payload };
    case START_TIMER:
      return {
        ...state,
        elapsedTime: 0,
      };
    case STOP_TIMER:
      return {
        ...state,
        elapsedTime: 0,
      };
    case UPDATE_TIMER:
      return {
        ...state,
        elapsedTime: action.payload,
      };
    case HANDLE_CALL_CLICKED:
      return {
        ...state,
        callData: action.payload,
      };
    case HANDLE_CHANGE_DTMF_NUMBER:
      return {
        ...state,
        dtmfSequence: action.payload,
      };
    case HANDLE_CALL_CONFERENCE_CLICKED:
      return {
        ...state,
        dtmfSequence: action.payload,
      };
    case HANDLE_CALL_TRANSFER_CLICKED:
      return {
        ...state,
        blindNumber: action.payload,
      };
    default:
      return state;
  }
};
