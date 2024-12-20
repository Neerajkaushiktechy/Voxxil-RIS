import { takeLatest, call, put } from 'redux-saga/effects';
import { postPatientEmergencyContactSuccess, postPatientEmergencyContactFailure, putPatientEmergencyContactSuccess, putPatientEmergencyContactFailure } from './slice';
import requestHandler from '../../../../utils/requestHandler';
import { logoutRequest } from '../../auth/authSlice';

function* postPatientEmergencyContactRequest(action) {
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
        const response = yield call(requestHandler, `${process.env.REACT_APP_SERVER_API}api/post-patient-emergencyContact`, requestDetail);
        yield put(postPatientEmergencyContactSuccess(response));
    } catch (error) {
        yield put(postPatientEmergencyContactFailure(error?.response?.message || error));
    }
}


function* putPatientEmergencyContactRequest(action) {
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
        const response = yield call(requestHandler, `${process.env.REACT_APP_SERVER_API}api/edit-patient-emergencyContact/${action.payload._id}`, requestDetail);
        yield put(putPatientEmergencyContactSuccess(response));
    } catch (error) {
        yield put(putPatientEmergencyContactFailure(error?.response?.message || error));
    }
}

function* saga() {
    yield takeLatest('patientEmergencyContact/postPatientRegistrationRequest', postPatientEmergencyContactRequest);
    yield takeLatest('patientEmergencyContact/putPatientEmergencyContactRequest', putPatientEmergencyContactRequest);
}

export default saga;