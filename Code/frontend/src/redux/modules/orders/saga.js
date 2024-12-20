import { takeLatest, call, put, select } from 'redux-saga/effects';
import { getSuccess, getFailure, getIdFailure, getIdSuccess, getPatientOrdersSuccess, getPatientOrdersFailure, putAppointmentStatusSuccess, putAppointmentStatusFailure } from './slice';
import requestHandler from '../../../utils/requestHandler';
import { logoutRequest } from '../auth/authSlice';

function* getRequest(action) {
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
        const response = yield call(requestHandler, `${process.env.REACT_APP_SERVER_API}api/orders/${action.payload.value}/${action.payload.elm}`, requestDetail);

        yield put(getSuccess(response));
    } catch (error) {
        yield put(getFailure(error?.response?.message || error));
    }
}

function* getRequestId(action) {
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
        const response = yield call(requestHandler, `${process.env.REACT_APP_SERVER_API}api/order/${action.payload}`, requestDetail);

        yield put(getIdSuccess(response));
    } catch (error) {
        yield put(getIdFailure(error?.response?.message || error));
    }
}

function* getPatientOrdersRequest(action) {
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
        const response = yield call(requestHandler, `${process.env.REACT_APP_SERVER_API}api/patient-orders/${action.payload}`, requestDetail);

        yield put(getPatientOrdersSuccess(response));
    } catch (error) {
        yield put(getPatientOrdersFailure(error?.response?.message || error));
    }
}

function* putAppointmentStatusRequest(action) {
    try {
        const requestDetail = {
            method: "PUT",
            headers: {
                "Authorization": localStorage.getItem("item"),
                "Content-Type": "application/json"
            },
            body: JSON.stringify(action.payload)
        };
        const response = yield call(requestHandler, `${process.env.REACT_APP_SERVER_API}api/order-status`, requestDetail);
        yield put(putAppointmentStatusSuccess(response));
    } catch (error) {
        yield put(putAppointmentStatusFailure(error?.response?.message || error));
    }
}


function* saga() {
    yield takeLatest('orders/getRequest', getRequest);
    yield takeLatest('orders/getIdRequest', getRequestId);
    yield takeLatest('orders/getPatientOrdersRequest', getPatientOrdersRequest);
    yield takeLatest('orders/putAppointmentStatusRequest', putAppointmentStatusRequest);
}

export default saga;