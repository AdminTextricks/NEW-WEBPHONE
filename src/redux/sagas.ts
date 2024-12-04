import { all } from "redux-saga/effects";

//auth
import loginSaga from "./auth/login/saga";
import profileSaga from "./profile/saga";
import LayoutSaga from "./layout/saga";
import contactsSaga from "./contacts/saga";
import callsSaga from "./calls/saga";
import chatsSaga from "./chats/saga";

export default function* rootSaga() {
  yield all([
    loginSaga(),
    profileSaga(),
    LayoutSaga(),
    contactsSaga(),
    callsSaga(),
    chatsSaga(),
  ]);
}
