import { takeLatest, call, put } from 'redux-saga/effects';
import { postPatientLifeStyleSuccess, postPatientLifeStyleFailure, putPatientLifeStyleSuccess, putPatientLifeStyleFailure } from './slice';
import requestHandler from '../../../../utils/requestHandler';
import { logoutRequest } from '../../auth/authSlice';

function* postPatientLifeStyleRequest(action) {
    try {
        let authToken = localStorage.getItem("item")
        if (!authToken) {
            yield put(logoutRequest());
            return; // Exit the generator if no authentication token is found
        }
        const requestDetail = {
            method: "POST",
            headers: {
                "Authorization": localStorage.getItem("item"),
                "Content-Type": "application/json"
            },
            body: JSON.stringify(action.payload)
        };
        const response = yield call(requestHandler, `${process.env.REACT_APP_SERVER_API}api/post-patient-lifeStyle`, requestDetail);
        yield put(postPatientLifeStyleSuccess(response));
    } catch (error) {
        yield put(postPatientLifeStyleFailure(error?.response?.message || error));
    }
}


function* putPatientLifeStyleRequest(action) {
    try {
        let authToken = localStorage.getItem("item")
        if (!authToken) {
            yield put(logoutRequest());
            return; // Exit the generator if no authentication token is found
        }
        const requestDetail = {
            method: "PUT",
            headers: {
                "Authorization": localStorage.getItem("item"),
                "Content-Type": "application/json"
            },
            body: JSON.stringify(action.payload)
        };
        const response = yield call(requestHandler, `${process.env.REACT_APP_SERVER_API}api/edit-patient-lifeStyle/${action.payload._id}`, requestDetail);
        yield put(putPatientLifeStyleSuccess(response));
    } catch (error) {
        yield put(putPatientLifeStyleFailure(error?.response?.message || error));
    }
}

function* saga() {
    yield takeLatest('patientLifeStyle/postPatientLifeStyleRequest', postPatientLifeStyleRequest);
    yield takeLatest('patientLifeStyle/putPatientLifeStyleRequest', putPatientLifeStyleRequest);
}

export default saga;