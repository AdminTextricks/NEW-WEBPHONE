// selectors.js
import { createSelector } from "reselect";

const selectCallHistory = (state: any) => state.CallHistory;

export const selectElapsedTime = createSelector(
  [selectCallHistory],
  callHistory => callHistory.elapsedTime,
);
