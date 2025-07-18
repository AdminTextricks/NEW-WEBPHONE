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

// Load initial state from sessionStorage if available
const loadState = (): SessionCallState => {
  try {
    const serializedState = sessionStorage.getItem('sessionCallState');
    if (serializedState === null) {
      return {
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
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.log('Error loading state from sessionStorage:', err);
    return {
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
  }
};

// Save state to sessionStorage
const saveState = (state: SessionCallState) => {
  try {
    const serializedState = JSON.stringify(state);
    sessionStorage.setItem('sessionCallState', serializedState);
  } catch (err) {
    console.log('Error saving state to sessionStorage:', err);
  }
};

const initialState: SessionCallState = loadState();

export const SessionCallReducer = (state = initialState, action: any) => {
  let newState;
  switch (action.type) {
    case CallsHistoryActionTypes.GET_CALLS_HISTORY:
      const updatedCallList = state.call_list.some(call => call.id === action.payload[0].id)
        ? state.call_list.map(call =>
          call.id === action.payload[0].id
            ? { ...call, ...action.payload[0] }
            : call
        )
        : [action.payload[0], ...state.call_list];

      const trimmedCallList = updatedCallList.slice(0, 10);

      const get_newState = {
        ...state,
        call_list: trimmedCallList,
      };
      newState = get_newState;
      break;
    case IsCallingActionTypes.IS_CALLING:
      newState = { ...state, getCallsLoading: action.payload };
      break;
    case IsCallBtnActionTypes.IS_WAITING:
      newState = { ...state, isCallWaiting: action.payload };
      break;
    case START_TIMER:
      newState = { ...state, elapsedTime: 0 };
      break;
    case STOP_TIMER:
      newState = { ...state, elapsedTime: 0, getCallsLoading: false };
      break;
    case UPDATE_TIMER:
      newState = { ...state, elapsedTime: action.payload };
      break;
    case HANDLE_CALL_CLICKED:
      newState = { ...state, callData: action.payload };
      break;
    case HANDLE_CHANGE_DTMF_NUMBER:
      newState = { ...state, dtmfSequence: action.payload };
      break;
    case HANDLE_CALL_CONFERENCE_CLICKED:
      newState = { ...state, dtmfSequence: action.payload };
      break;
    case HANDLE_CALL_TRANSFER_CLICKED:
      newState = { ...state, blindNumber: action.payload };
      break;
    default:
      newState = { ...state, getCallsLoading: false };
      break;
  }

  // Save the new state to sessionStorage
  saveState(newState);
  return newState;
};