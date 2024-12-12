import { takeLatest, call, put } from 'redux-saga/effects';
import { getMasterDataSuccess, getMasterDataFailure, postPatientRegistrationSuccess, postPatientRegistrationFailure, getPatientInformationSuccess, getPatientInformationFailure, deletePatientInformationSuccess, deletePatientInformationFailure, putPatientInformationSuccess, putPatientInformationFailure } from './slice';
import requestHandler from '../../../../utils/requestHandler';
import { updatePatientImagingAttachement } from '../../../../utils/api';
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
        const response = yield call(requestHandler, `${process.env.REACT_APP_SERVER_API}api/get-registration-masterData`, requestDetail);
        yield put(getMasterDataSuccess(response));
    } catch (error) {
        yield put(getMasterDataFailure(error?.response?.message || error));
    }
}
function* postPatientRegistrationRequest(action) {
    try {
        const requestDetail = {
            method: "POST",
            headers: {
                "Authorization": localStorage.getItem("item"),
                "Content-Type": "application/json"
            },
            body: JSON.stringify(action.payload)
        };
        const response = yield call(requestHandler, `${process.env.REACT_APP_SERVER_API}api/post-patient-registration`, requestDetail);
        const fileUploadRes = yield call(updatePatientImagingAttachement, action.payload.fileFormData, response.pId);
        if(fileUploadRes?.data?.medicalHistory?.imagingStudies){
            response.patientdata.medicalHistory.imagingStudies = fileUploadRes?.data?.medicalHistory?.imagingStudies
        }
        yield put(postPatientRegistrationSuccess(response));
    } catch (error) {
        yield put(postPatientRegistrationFailure(error?.response?.message || error));
    }
}



function* getPatientInformationRequest(action) {
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
        let requestURL = `${process.env.REACT_APP_SERVER_API}api/get-patient-information/${action.payload.currentBranch}?limit=${action.payload.limit}&skip=${action.payload.skip}&search=${action.payload.search}&searchType=${action.payload.searchType}`;
        const response = yield call(requestHandler, requestURL, requestDetail);
        yield put(getPatientInformationSuccess(response));
    } catch (error) {
        yield put(getPatientInformationFailure(error?.response?.message || error));
    }
}

function* deletePatientInformationRequest(action) {
    try {
        const requestDetail = {
            method: "DELETE",
            headers: {
                "Authorization": localStorage.getItem("item"),
                "Content-Type": "application/json"
            }
        };
        const response = yield call(requestHandler, `${process.env.REACT_APP_SERVER_API}api/delete-patient-information/${action.payload}`, requestDetail);
        yield put(deletePatientInformationSuccess(response));
    } catch (error) {
        yield put(deletePatientInformationFailure(error?.response?.message || error));
    }
}

function* putPatientInformationRequest(action) {
    try {
        const requestDetail = {
            method: "PUT",
            headers: {
                "Authorization": localStorage.getItem("item"),
                // "Content-Type": "application/json"
            },
            // body: JSON.stringify(action.payload)
            body: action.payload.formData
        };
        const response = yield call(requestHandler, `${process.env.REACT_APP_SERVER_API}api/edit-patient-information/${action.payload._id}`, requestDetail);
        yield put(putPatientInformationSuccess(response));
    } catch (error) {
        yield put(putPatientInformationFailure(error?.response?.message || error));
    }
}


function* saga() {
    yield takeLatest('patientRegistration/getMasterDataRequest', getMasterDataRequest);
    yield takeLatest('patientRegistration/postPatientRegistrationRequest', postPatientRegistrationRequest);
    yield takeLatest('patientRegistration/getPatientInformationRequest', getPatientInformationRequest);
    yield takeLatest('patientRegistration/deletePatientInformationRequest', deletePatientInformationRequest);
    yield takeLatest('patientRegistration/putPatientInformationRequest', putPatientInformationRequest);
}

export default saga;