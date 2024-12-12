import { select, takeLatest, call, put } from 'redux-saga/effects';
import { getSuccess, getFailure, postSuccess, postFailure, deleteSuccess, deleteFailure, putSuccess, putFailure, getPatientSuccess, getPatientFailure, getIdSuccess, getIdFailure } from './slice';
import requestHandler from '../../../utils/requestHandler';
import { logoutRequest } from '../auth/authSlice';

function* getRequest(action) {
    try {
        let authToken = localStorage.getItem("item")
        if (!authToken) {
            yield put(logoutRequest());
            return; // Exit the generator if no authentication token is found
        }
        const { page, limit, searchQuery = "" } = action.payload || { page: 1, limit: null, searchQuery: "" };
        const currentBranch = yield select(state => state.branch.currentBranch);
        const requestDetail = {
            method: "GET",
            headers: {
                "Authorization": authToken,
                "Content-Type": "application/json",
                "X-Current-Branch": currentBranch.id
            }
        };
        const response = yield call(requestHandler, `${process.env.REACT_APP_SERVER_API}api/radiology?page=${page}&limit=${limit}&searchQuery=${searchQuery}`, requestDetail);
        yield put(getSuccess(response));
    } catch (error) {
        yield put(getFailure(error?.response?.message || error));
    }
}
function* getIdRequest(action) {
    try {
        let authToken = localStorage.getItem("item")
        if (!authToken) {
            yield put(logoutRequest());
            return; // Exit the generator if no authentication token is found
        }
        const currentBranch = yield select(state => state.branch.currentBranch);
        const requestDetail = {
            method: "GET",
            headers: {
                "Authorization": authToken,
                "Content-Type": "application/json",
                "X-Current-Branch": currentBranch.id
            }
        };
        const response = yield call(requestHandler, `${process.env.REACT_APP_SERVER_API}api/radiology/${action.payload}`, requestDetail);
        yield put(getIdSuccess(response));
    } catch (error) {
        yield put(getIdFailure(error?.response?.message || error));
    }
}

function* getRadiologyAppointmentData(action) {
    try {
        let authToken = localStorage.getItem("item")
        if (!authToken) {
            yield put(logoutRequest());
            return;
        }
        const currentBranch = yield select(state => state.branch.currentBranch);
        const requestDetail = {
            method: "GET",
            headers: {
                "Authorization": authToken,
                "Content-Type": "application/json",
                "X-Current-Branch": currentBranch.id
            }
        };
        const response = yield call(requestHandler, `${process.env.REACT_APP_SERVER_API}api/radiology-appointment/${action.payload}`, requestDetail);
        yield put(getIdSuccess(response));
    } catch (error) {
        yield put(getIdFailure(error?.response?.message || error));
    }
}


function* postRequest(action) {
    try {
        const currentBranch = yield select(state => state.branch.currentBranch);
        const requestDetail = {
            method: "POST",
            headers: {
                "Authorization": localStorage.getItem("item"),
                "Content-Type": "application/json",
                "X-Current-Branch": currentBranch.id

            },
            body: JSON.stringify(action.payload)
        };
        const response = yield call(requestHandler, `${process.env.REACT_APP_SERVER_API}api/radiology`, requestDetail);
        yield put(postSuccess(response));
    } catch (error) {
        yield put(postFailure(error?.response?.message || error));
    }
}

function* deleteRequest(action) {
    try {
        const requestDetail = {
            method: "DELETE",
            headers: {
                "Authorization": localStorage.getItem("item"),
                "Content-Type": "application/json"
            }
        };
        const response = yield call(requestHandler, `${process.env.REACT_APP_SERVER_API}api/radiology/${action.payload}`, requestDetail);
        yield put(deleteSuccess(response));
    } catch (error) {
        yield put(deleteFailure(error?.response?.message || error));
    }
}

function* putRequest(action) {
    try {
        const currentBranch = yield select(state => state.branch.currentBranch);
        const requestDetail = {
            method: "PUT",
            headers: {
                "Authorization": localStorage.getItem("item"),
                "Content-Type": "application/json",
                "X-Current-Branch": currentBranch.id
            },
            body: JSON.stringify(action.payload)
        };
        const response = yield call(requestHandler, `${process.env.REACT_APP_SERVER_API}api/radiology`, requestDetail);
        yield put(putSuccess(response));
    } catch (error) {
        yield put(putFailure(error?.response?.message || error));
    }
}

function* getPatientRequest(action) {
    try {
        let authToken = localStorage.getItem("item")
        if (!authToken) {
            yield put(logoutRequest());
            return; // Exit the generator if no authentication token is found
        }
        const currentBranch = yield select(state => state.branch.currentBranch);
        const requestDetail = {
            method: "GET",
            headers: {
                "Authorization": authToken,
                "Content-Type": "application/json",
                "X-Current-Branch": currentBranch.id
            }
        };
        const name = action.payload.name||'';
        const page = action.payload.page||1;
        const limit = action.payload.limit||10;
        const response = yield call(requestHandler, `${process.env.REACT_APP_SERVER_API}api/profile-search?name=${name}&limit=${limit}&page=${page}`, requestDetail);
        yield put(getPatientSuccess(response));
    } catch (error) {
        yield put(getPatientFailure(error?.response?.message || error));
    }
}

function* saga() {
    // yield takeLatest('radiology/addPatientRequest', addPatientRequest);
    yield takeLatest('radiology/getRequest', getRequest);
    yield takeLatest('radiology/getIdRequest', getIdRequest);
    yield takeLatest('radiology/postRequest', postRequest);
    yield takeLatest('radiology/deleteRequest', deleteRequest);
    yield takeLatest('radiology/putRequest', putRequest);
    yield takeLatest('radiology/getPatientRequest', getPatientRequest);
    yield takeLatest('radiology/getRadiologyAppointmentData', getRadiologyAppointmentData);
}

export default saga;