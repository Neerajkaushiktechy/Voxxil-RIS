import { takeLatest, call, put } from 'redux-saga/effects';
import { getMasterDataSuccess, getMasterDataFailure, getPatientProfileSuccess, getPatientProfileFailure, deletePatientProfileSuccess, deletePatientProfileFailure, getPatientDataSuccess, getPatientDataFailure } from './slice';
import requestHandler from '../../../../utils/requestHandler';
import { logoutRequest } from '../../auth/authSlice';

function* getMasterDataRequest() {
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
        const response = yield call(requestHandler, `${process.env.REACT_APP_SERVER_API}api/get-patient-profile-masterData`, requestDetail);
        yield put(getMasterDataSuccess(response));
    } catch (error) {
        yield put(getMasterDataFailure(error?.response?.message || error));
    }
}

function* getPatientProfileRequest(action) {
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
        let requestURL = `${process.env.REACT_APP_SERVER_API}api/get-patient-profile/${action.payload.currentBranch}?limit=${action.payload.limit}&skip=${action.payload.skip}&search=${action.payload.search}&searchType=${action.payload.searchType}`;
        const response = yield call(requestHandler, requestURL, requestDetail);
        yield put(getPatientProfileSuccess(response));
    } catch (error) {
        yield put(getPatientProfileFailure(error?.response?.message || error));
    }
}

function* getPatientDataRequest(action) {
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
        let requestURL = `${process.env.REACT_APP_SERVER_API}api/get-patient-data/${action.payload.type}/${action.payload.id}`;
        const response = yield call(requestHandler, requestURL, requestDetail);
        yield put(getPatientDataSuccess(response));
    } catch (error) {
        yield put(getPatientDataFailure(error?.response?.message || error));
    }
}

function* deletePatientProfileRequest(action) {
    try {
        const requestDetail = {
            method: "DELETE",
            headers: {
                "Authorization": localStorage.getItem("item"),
                "Content-Type": "application/json"
            }
        };
        const response = yield call(requestHandler, `${process.env.REACT_APP_SERVER_API}api/delete-patient-Profile/${action.payload}`, requestDetail);
        yield put(deletePatientProfileSuccess(response));
    } catch (error) {
        yield put(deletePatientProfileFailure(error?.response?.message || error));
    }
}


function* saga() {
    yield takeLatest('patientProfile/getMasterDataRequest', getMasterDataRequest);
    yield takeLatest('patientProfile/getPatientProfileRequest', getPatientProfileRequest);
    yield takeLatest('patientProfile/getPatientDataRequest', getPatientDataRequest);
    yield takeLatest('patientProfile/deletePatientProfileRequest', deletePatientProfileRequest);
}

export default saga;