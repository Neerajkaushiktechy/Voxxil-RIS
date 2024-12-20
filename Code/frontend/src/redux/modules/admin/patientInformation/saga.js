import { select, takeLatest, call, put } from 'redux-saga/effects';
import { postPatientInformationSuccess, postPatientInformationFailure, putPatientInformationSuccess, putPatientInformationFailure } from './slice';
import { postPatientEmergencyContactSuccess, postPatientEmergencyContactFailure } from '../patientEmergencyContactInfo/slice';
import requestHandler from '../../../../utils/requestHandler';
import { logoutRequest } from '../../auth/authSlice';
import { uploadPatientFiles } from '../../../../utils/api';


function* postPatientInformationRequest(action) {
    try {
        let authToken = localStorage.getItem("item")
        if (!authToken) {
            yield put(logoutRequest());
            return; // Exit the generator if no authentication token is found
        }
        const currentBranch = yield select(state => state.branch.currentBranch);
        const requestDetail = {
            method: "POST",
            headers: {
                "Authorization": localStorage.getItem("item"),
                "Content-Type": "application/json"
            },
            body: JSON.stringify(action.payload)
        };
        const response = yield call(requestHandler, `${process.env.REACT_APP_SERVER_API}api/post-patient-information`, requestDetail);
        if (response.success) {
            if (action.payload.fileFormData) {
                const fileUploadRes = yield call(uploadPatientFiles, action.payload.fileFormData, currentBranch.id, response.pId);
                if (fileUploadRes?.data?.imagingStudies) {
                    response.imagingStudies = fileUploadRes?.data?.imagingStudies
                }
            } else {
                try {
                    const requestDetail = {
                        method: "POST",
                        headers: {
                            "Authorization": localStorage.getItem("item"),
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ formData: action.payload, pId: response.pId, branchId: response.patientdata.branchId })
                    };
                    const res = yield call(requestHandler, `${process.env.REACT_APP_SERVER_API}api/post-patient-emergencyContact`, requestDetail);
                    yield put(
                        postPatientEmergencyContactSuccess(res)
                    );
                } catch (err) {
                    yield put(
                        postPatientEmergencyContactFailure(err.message)
                    );
                }
            }
        }

        yield put(postPatientInformationSuccess(response));
    } catch (error) {
        yield put(postPatientInformationFailure(error?.response?.message || error));
    }
}

function* putPatientInformationRequest(action) {
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
        const response = yield call(requestHandler, `${process.env.REACT_APP_SERVER_API}api/put-patient-information/${action.payload._id}`, requestDetail);
        yield put(putPatientInformationSuccess(response));
    } catch (error) {
        yield put(putPatientInformationFailure(error?.response?.message || error));
    }
}

function* saga() {
    yield takeLatest('patientInformation/postPatientInformationRequest', postPatientInformationRequest);
    yield takeLatest('patientInformation/putPatientInformationRequest', putPatientInformationRequest);
}

export default saga;