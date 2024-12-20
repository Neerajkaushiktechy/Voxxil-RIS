import { takeLatest, call, put } from 'redux-saga/effects';
import { postPatientMedicalHistorySuccess, postPatientMedicalHistoryFailure, putPatientMedicalHistorySuccess, putPatientMedicalHistoryFailure } from './slice';
import requestHandler from '../../../../utils/requestHandler';
import { updatePatientImagingAttachement } from '../../../../utils/api';


function* postPatientMedicalHistoryRequest(action) {
    try {
        const requestDetail = {
            method: "POST",
            headers: {
                "Authorization": localStorage.getItem("item"),
                "Content-Type": "application/json"
            },
            body: JSON.stringify(action.payload)
        };
        const response = yield call(requestHandler, `${process.env.REACT_APP_SERVER_API}api/post-patient-medical-history`, requestDetail);
        if (response.success) {
            const fileUploadRes = yield call(updatePatientImagingAttachement, action.payload.fileFormData, action.payload.pId);
            if (fileUploadRes?.data?.imagingStudies) {
                response.imagingStudies = fileUploadRes?.data?.imagingStudies
            }
        }
        yield put(postPatientMedicalHistorySuccess(response));
    } catch (error) {
        yield put(postPatientMedicalHistoryFailure(error?.response?.message || error));
    }
}


function* putPatientMedicalHistoryRequest(action) {
    try {
        const requestDetail = {
            method: "PUT",
            headers: {
                "Authorization": localStorage.getItem("item"),
            },
            body: action.payload.formData
        };
        const response = yield call(requestHandler, `${process.env.REACT_APP_SERVER_API}api/edit-patient-medical-history/${action.payload._id}`, requestDetail);
        yield put(putPatientMedicalHistorySuccess(response));
    } catch (error) {
        yield put(putPatientMedicalHistoryFailure(error?.response?.message || error));
    }
}


function* saga() {
    yield takeLatest('patientMedicalHistory/postPatientMedicalHistoryRequest', postPatientMedicalHistoryRequest);
    yield takeLatest('patientMedicalHistory/putPatientMedicalHistoryRequest', putPatientMedicalHistoryRequest);
}

export default saga;