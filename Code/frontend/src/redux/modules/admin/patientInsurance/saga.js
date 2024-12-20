import { takeLatest, call, put } from 'redux-saga/effects';
import { postPatientInsuranceSuccess, postPatientInsuranceFailure, putPatientInsuranceSuccess, putPatientInsuranceFailure } from './slice';
import requestHandler from '../../../../utils/requestHandler';
import { logoutRequest } from '../../auth/authSlice';

function* postPatientInsuranceRequest(action) {
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
        const response = yield call(requestHandler, `${process.env.REACT_APP_SERVER_API}api/post-patient-insurance`, requestDetail);
        yield put(postPatientInsuranceSuccess(response));
    } catch (error) {
        yield put(postPatientInsuranceFailure(error?.response?.message || error));
    }
}


function* putPatientInsuranceRequest(action) {
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
        const response = yield call(requestHandler, `${process.env.REACT_APP_SERVER_API}api/edit-patient-insurance/${action.payload._id}`, requestDetail);
        yield put(putPatientInsuranceSuccess(response));
    } catch (error) {
        yield put(putPatientInsuranceFailure(error?.response?.message || error));
    }
}

function* saga() {
    yield takeLatest('patientInsurance/postPatientInsuranceRequest', postPatientInsuranceRequest);
    yield takeLatest('patientInsurance/putPatientInsuranceRequest', putPatientInsuranceRequest);
}

export default saga;