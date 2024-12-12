import { takeLatest, call, put } from 'redux-saga/effects';
import { getSuccess, getFailure, putSuccess, putFailure, putPasswordFailure, putPasswordSuccess, getPatientSuccess, getPatientFailure } from './slice';
import requestHandler from '../../../utils/requestHandler';
import { logoutRequest } from '../auth/authSlice';

function* getRequest() {
    try {
        let authToken = localStorage.getItem("item")
        if (!authToken) {
            yield put(logoutRequest());
            return; // Exit the generator if no authentication token is found
        }
        const requestDetail = {
            method: "GET",
            headers: {
                "Authorization": authToken,
                "Content-Type": "application/json"
            }
        };
        const response = yield call(requestHandler, `${process.env.REACT_APP_SERVER_API}api/profile`, requestDetail);

        yield put(getSuccess(response));
    } catch (error) {
        yield put(logoutRequest());
        yield put(getFailure(error?.response?.message || error));
    }
}

function* getPatientRequest() {
    try {
        let authToken = localStorage.getItem("item")
        if (!authToken) {
            yield put(logoutRequest());
            return;
        }
        const requestDetail = {
            method: "GET",
            headers: {
                "Authorization": authToken,
                "Content-Type": "application/json"
            }
        };
        const response = yield call(requestHandler, `${process.env.REACT_APP_SERVER_API}api/patient-profile`, requestDetail);
        yield put(getPatientSuccess(response));
    } catch (error) {
        yield put(logoutRequest());
        yield put(getPatientFailure(error?.response?.message || error));
    }
}

function* putRequest(action) {
    try {
        const requestDetail = {
            method: "PUT",
            headers: {
                "Authorization": localStorage.getItem("item"),
            },
            body: action.payload
        };
        const response = yield call(requestHandler, `${process.env.REACT_APP_SERVER_API}api/profile`, requestDetail);
        yield put(putSuccess(response));
    } catch (error) {
        yield put(putFailure(error?.response?.message || error));
    }
}

function* putPasswordRequest(action) {
    try {
        const requestDetail = {
            method: "PUT",
            headers: {
                "Authorization": localStorage.getItem("item"),
                "Content-Type": "application/json"
            },
            body: JSON.stringify(action.payload)
        };
        const response = yield call(requestHandler, `${process.env.REACT_APP_SERVER_API}api/profile-password`, requestDetail);
        yield put(putPasswordSuccess(response));
    } catch (error) {
        yield put(putPasswordFailure(error?.response?.message || error));
    }
}

function* saga() {
    yield takeLatest('profile/getRequest', getRequest);
    yield takeLatest('profile/getPatientRequest', getPatientRequest);
    yield takeLatest('profile/putRequest', putRequest);
    yield takeLatest('profile/putPasswordRequest', putPasswordRequest);
}

export default saga;