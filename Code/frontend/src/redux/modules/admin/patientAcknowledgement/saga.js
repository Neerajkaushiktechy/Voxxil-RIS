import { takeLatest, call, put } from 'redux-saga/effects';
import { postPatientAcknowledgementSuccess, postPatientAcknowledgementFailure, putPatientAcknowledgementSuccess, putPatientAcknowledgementFailure } from './slice';
import requestHandler from '../../../../utils/requestHandler';
import { logoutRequest } from '../../auth/authSlice';

function* postPatientAcknowledgementRequest(action) {
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
        const response = yield call(requestHandler, `${process.env.REACT_APP_SERVER_API}api/post-patient-acknowledgement`, requestDetail);
        yield put(postPatientAcknowledgementSuccess(response));
    } catch (error) {
        yield put(postPatientAcknowledgementFailure(error?.response?.message || error));
    }
}


function* putPatientAcknowledgementRequest(action) {
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
        const response = yield call(requestHandler, `${process.env.REACT_APP_SERVER_API}api/edit-patient-acknowledgement/${action.payload._id}`, requestDetail);
        yield put(putPatientAcknowledgementSuccess(response));
    } catch (error) {
        yield put(putPatientAcknowledgementFailure(error?.response?.message || error));
    }
}

function* saga() {
    yield takeLatest('patientAcknowledgement/postPatientAcknowledgementRequest', postPatientAcknowledgementRequest);
    yield takeLatest('patientAcknowledgement/putPatientAcknowledgementRequest', putPatientAcknowledgementRequest);
}

export default saga;