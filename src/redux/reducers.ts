import { combineReducers } from "redux";

import Login from "./auth/login/reducer";
import Layout from "./layout/reducer";
import Profile from "./profile/reducer";
import Contacts from "./contacts/reducer";
import Calls from "./calls/reducer";
import Chats from "./chats/reducer";

import { SIPReducer } from "./jssipconnection/reducer";
import { SessionCallReducer as CallHistory } from "./sessionCall/reducer";

export default combineReducers({
  Login,
  Layout,
  Profile,
  Contacts,
  Calls,
  Chats,

  SIPReducer,
  CallHistory,
});
