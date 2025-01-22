// reducer.ts
import { SIPActionTypes } from "./actions";

const initialState = {
  userAgent: null,
  userAgentSession: null,
  isActive: false,
};

export const SIPReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case SIPActionTypes.SET_USER_AGENT:
      return { ...state, userAgent: action.payload };
    case SIPActionTypes.SET_SESSION:
      return { ...state, userAgentSession: action.payload };
    case SIPActionTypes.SET_ACTIVE_STATUS:
      return { ...state, isActive: action.payload };
    default:
      return state;
  }
};
