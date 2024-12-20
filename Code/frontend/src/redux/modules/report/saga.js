import { takeLatest, call, put, select } from 'redux-saga/effects';
import { getSuccess, getFailure, postReportSuccess, postReportFailure, getReportSuccess, getReportFailure, getInstancesSuccess, getInstancesFailure, getStudiesSuccess, getStudiesFailure, getStudiesImagesSuccess, getStudiesImagesFailure,getSeniorRadiologistSuccess, getSeniorRadiologistFailure, getParentPatientSuccess, getParentPatientFailure, getGenerateReportPDFSuccess, getGenerateReportPDFFailure, getGenerateReportPDFRequest } from './slice';
import requestHandler from '../../../utils/requestHandler';
import { logoutRequest } from '../auth/authSlice';

function* getRequest() {
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
        const response = yield call(requestHandler, `${process.env.REACT_APP_SERVER_API}api/getPatients`, requestDetail);

        yield put(getSuccess(response));
    } catch (error) {
        yield put(getFailure(error?.response?.message || error));
    }
}

function* getParentPatientRequest(action) {
    const { radiologyId, orthancPatientId,orderId } = action.payload;
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

        let response = yield call(requestHandler, `${process.env.REACT_APP_SERVER_API}api/${radiologyId}/parent-patient?patientID=${orthancPatientId}&orderId=${orderId}`, requestDetail);

        yield put(getParentPatientSuccess(response));
    } catch (error) {
        yield put(getParentPatientFailure(error?.response?.message || error));
    }
}


function* getInstancesRequest(action) {
    const { studyID } = action.payload
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

        let response = yield call(requestHandler, `${process.env.REACT_APP_SERVER_API}api/instance/${studyID}`, requestDetail);

        yield put(getInstancesSuccess(response));
    } catch (error) {
        yield put(getInstancesFailure(error?.response?.message || error));
    }
}

function* postReportRequest(action) {
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
                "Authorization": authToken,
                "Content-Type": "application/json",
                "X-Current-Branch": currentBranch.id
            },
            body: JSON.stringify(action.payload)
        };

        const response = yield call(requestHandler, `${process.env.REACT_APP_SERVER_API}api/report`, requestDetail);

        yield put(postReportSuccess(response));
    } catch (error) {
        yield put(postReportFailure(error?.response?.message || error));
    }
}

function* putReportRequest(action) {
    try {
        let authToken = localStorage.getItem("item")
        if (!authToken) {
            yield put(logoutRequest());
            return; // Exit the generator if no authentication token is found
        }

        const currentBranch = yield select(state => state.branch.currentBranch);
        const requestDetail = {
            method: "PUT",
            headers: {
                "Authorization": authToken,
                "Content-Type": "application/json",
                "X-Current-Branch": currentBranch.id
            },
            body: JSON.stringify(action.payload)
        };

        const response = yield call(requestHandler, `${process.env.REACT_APP_SERVER_API}api/report`, requestDetail);

        yield put(postReportSuccess(response));
    } catch (error) {
        yield put(postReportFailure(error?.response?.message || error));
    }
}

function* getStudiesRequest(action) {
    const { orthancParentPatientId,orderId } = action.payload;

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

        const response = yield call(requestHandler, `${process.env.REACT_APP_SERVER_API}api/${orthancParentPatientId}/studies?orderId=${orderId}`, requestDetail);

        yield put(getStudiesSuccess(response));
    } catch (error) {
        yield put(getStudiesFailure(error?.response?.message || error));
    }
}

function* getStudiesImagesRequest(action) {
    try {
        const { orthancStudyID } = action.payload
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

        const response = yield call(requestHandler, `${process.env.REACT_APP_SERVER_API}api/${orthancStudyID}/images`, requestDetail);

        yield put(getStudiesImagesSuccess(response));
    } catch (error) {
        yield put(getStudiesImagesFailure(error?.response?.message || error));
    }
}

function* getReportRequest(action) {
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

        const response = yield call(requestHandler, `${process.env.REACT_APP_SERVER_API}api/report/${action.payload}`, requestDetail);

        yield put(getReportSuccess(response));
    } catch (error) {
        yield put(getReportFailure(error?.response?.message || error));
    }
}

function* getSeniorRadiologistRequest() {
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
        const response = yield call(requestHandler, `${process.env.REACT_APP_SERVER_API}api/getSeniorRadiologistRequest`, requestDetail);

        yield put(getSeniorRadiologistSuccess(response));
    } catch (error) {
        yield put(getSeniorRadiologistFailure(error?.response?.message || error));
    }
}

function* generateReportPDFRequest(action) {
    try {
        let authToken = localStorage.getItem("item");
        if (!authToken) {
            yield put(logoutRequest());
            return; // Exit the generator if no authentication token is found
        }

        const currentBranch = yield select(state => state.branch.currentBranch);
        const requestDetail = {
            method: "POST",
            headers: {
                "Authorization": authToken,
                "Content-Type": "application/json",
                'Accept': 'application/pdf',

                "X-Current-Branch": currentBranch.id
            },
            body: JSON.stringify(action.payload),
            responseType: 'blob'
        };

        const response = yield call(fetch, `${process.env.REACT_APP_SERVER_API}api/generateReportPDF`, requestDetail);

        if (response.status === 200) {
            const blob = yield response.blob();
            const blobRes= new Blob([blob], { type: 'application/pdf' });
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blobRes);
            link.download = 'Report.pdf';
            document.body.appendChild(link);
            link.click();
      
            // Clean up
            document.body.removeChild(link);
            yield put(getGenerateReportPDFSuccess(blob));
        } else {
            throw new Error(response.statusText);
        }
    } catch (error) {
        yield put(getGenerateReportPDFFailure(error?.message || error));
    }
}

function* saga() {
    yield takeLatest('report/getRequest', getRequest);
    // yield takeLatest('report/getPatientAppointmentRequest', getPatientAppointmentRequest);
    yield takeLatest('report/postReportRequest', postReportRequest);
    yield takeLatest('report/putReportRequest', putReportRequest);
    yield takeLatest('report/getReportRequest', getReportRequest);
    yield takeLatest('report/getInstancesRequest', getInstancesRequest);
    yield takeLatest('report/getStudiesRequest', getStudiesRequest);
    yield takeLatest('report/getStudiesImagesRequest', getStudiesImagesRequest);
    yield takeLatest('report/getSeniorRadiologistRequest', getSeniorRadiologistRequest);
    yield takeLatest('report/getParentPatientRequest', getParentPatientRequest);
    yield takeLatest('report/getGenerateReportPDFRequest', generateReportPDFRequest);
}

export default saga;