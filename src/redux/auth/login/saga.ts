import { call, put, takeEvery, takeLatest } from "redux-saga/effects";

// Login Redux States
import { AuthLoginActionTypes } from "./types";
import {
  authLoginApiResponseSuccess,
  authLoginApiResponseError,
} from "./actions";

import { postJwtLogin } from "../../../api/index";

function* loginUser({ payload: { user } }: any) {
  try {
    const response: Promise<any> = yield call(postJwtLogin, {
      name: user.name,
      secret: user.secret,
    });
    yield put(
      authLoginApiResponseSuccess(AuthLoginActionTypes.LOGIN_USER, response),
    );
  } catch (error: any) {
    yield put(
      authLoginApiResponseError(AuthLoginActionTypes.LOGIN_USER, error),
    );
  }
}

function* logoutUser() {
  try {
    localStorage.removeItem("authUser");

    yield put(
      authLoginApiResponseSuccess(AuthLoginActionTypes.LOGOUT_USER, true),
    );
  } catch (error: any) {
    yield put(
      authLoginApiResponseError(AuthLoginActionTypes.LOGOUT_USER, error),
    );
  }
}

function* loginSaga() {
  yield takeEvery(AuthLoginActionTypes.LOGIN_USER, loginUser);
  yield takeEvery(AuthLoginActionTypes.LOGOUT_USER, logoutUser);
}

export default loginSaga;
