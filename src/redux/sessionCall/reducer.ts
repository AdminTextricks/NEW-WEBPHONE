// reducer.ts
import {
  Call,
  CallsHistoryActionTypes,
  HANDLE_CALL_CLICKED,
  IsCallingActionTypes,
  START_TIMER,
  STOP_TIMER,
  UPDATE_TIMER,
} from "./types";

interface SessionCallState {
  call_list: Call[];
  getCallsLoading: Boolean;
  current_callers: Call[];
  queue_callers: Call[];
  elapsedTime: any;
  callData: any;
}

const initialState: SessionCallState = {
  call_list: [],
  getCallsLoading: false,
  current_callers: [],
  queue_callers: [],
  elapsedTime: 0,
  callData: null,
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
    default:
      return state;
  }
};
