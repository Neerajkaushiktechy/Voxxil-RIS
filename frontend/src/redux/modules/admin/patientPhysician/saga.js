import { takeLatest, call, put } from 'redux-saga/effects';
import { postPatientPhysicianSuccess, postPatientPhysicianFailure, putPatientPhysicianSuccess, putPatientPhysicianFailure } from './slice';
import requestHandler from '../../../../utils/requestHandler';
import { logoutRequest } from '../../auth/authSlice';

function* postPatientPhysicianRequest(action) {
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
        const response = yield call(requestHandler, `${process.env.REACT_APP_SERVER_API}api/post-patient-physician`, requestDetail);
        yield put(postPatientPhysicianSuccess(response));
    } catch (error) {
        yield put(postPatientPhysicianFailure(error?.response?.message || error));
    }
}


function* putPatientPhysicianRequest(action) {
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
        const response = yield call(requestHandler, `${process.env.REACT_APP_SERVER_API}api/edit-patient-physician/${action.payload._id}`, requestDetail);
        yield put(putPatientPhysicianSuccess(response));
    } catch (error) {
        yield put(putPatientPhysicianFailure(error?.response?.message || error));
    }
}

function* saga() {
    yield takeLatest('patientPhysician/postPatientPhysicianRequest', postPatientPhysicianRequest);
    yield takeLatest('patientPhysician/putPatientPhysicianRequest', putPatientPhysicianRequest);
}

export default saga;