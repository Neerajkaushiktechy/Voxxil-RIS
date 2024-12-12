import { takeLatest, call, put } from 'redux-saga/effects';
import { loginSuccess, loginFailure, logoutSuccess, resetPasswordSuccess, resetPasswordFailure, updatePasswordSuccess, updatePasswordFailure } from './authSlice';
import requestHandler from '../../../utils/requestHandler';

let decodeToken = (token) => {
  return JSON.parse(window.atob(token.split('.')[1]));
}

function* login(action) {
  try {
    const requestDetail = {
      method: "POST",
      body: JSON.stringify(action.payload),
      headers: { "Content-Type": "application/json" }
    };
    const response = yield call(requestHandler, `${process.env.REACT_APP_SERVER_API}auth/login`, requestDetail);
    if (response?.token) {
      localStorage.setItem("item", response?.token);
      response.userData = decodeToken(response?.token)
    }
    yield put(loginSuccess(response));
  } catch (error) {
    yield put(loginFailure(error?.response?.message || error));
  }
}

function* resetPassword(action) {
  try {
    const requestDetail = {
      method: "POST",
      body: JSON.stringify(action.payload),
      headers: { "Content-Type": "application/json" }
    };
    const response = yield call(requestHandler, `${process.env.REACT_APP_SERVER_API}auth/reset-password`, requestDetail);

    yield put(resetPasswordSuccess(response));
  } catch (error) {
    yield put(resetPasswordFailure(error?.response?.message || error));
  }
}
function* updatePassword(action) {
  try {
    const requestDetail = {
      method: "POST",
      body: JSON.stringify(action.payload),
      headers: { "Content-Type": "application/json", Authorization: action.payload.Authorization },
    };
    const response = yield call(requestHandler, `${process.env.REACT_APP_SERVER_API}auth/update-password`, requestDetail);

    yield put(updatePasswordSuccess(response));
  } catch (error) {
    yield put(updatePasswordFailure(error?.response?.message || error));
  }
}

function* logout() {
  localStorage.removeItem('item');
  localStorage.removeItem('isLoggedIn');
  sessionStorage.removeItem('defaultBranch');
  yield put(logoutSuccess());
}

function* authSaga() {
  yield takeLatest('auth/loginRequest', login);
  yield takeLatest('auth/logoutRequest', logout);
  yield takeLatest('auth/resetPasswordRequest', resetPassword);
  yield takeLatest('auth/updatePasswordRequest', updatePassword);
}

export default authSaga;
