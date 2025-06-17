// actions.ts
export const SIPActionTypes = {
  SET_USER_AGENT: "SET_USER_AGENT",
  SET_SESSION: "SET_SESSION",
  SET_ACTIVE_STATUS: "SET_ACTIVE_STATUS",
};

export const setUserAgent = (userAgent: any) => ({
  type: SIPActionTypes.SET_USER_AGENT,
  payload: userAgent,
});

export const setSession = (session: any) => ({
  type: SIPActionTypes.SET_SESSION,
  payload: session,
});

export const setActiveStatus = (isActive: boolean) => ({
  type: SIPActionTypes.SET_ACTIVE_STATUS,
  payload: isActive,
});
