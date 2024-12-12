import { takeLatest, call, put, select } from 'redux-saga/effects';
import { getSuccess, getFailure, postSuccess, postFailure, putSuccess, putFailure } from './slice';
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
        const response = yield call(requestHandler, `${process.env.REACT_APP_SERVER_API}api/invoice/${action.payload.elm}`, requestDetail);

        yield put(getSuccess(response));
    } catch (error) {
        yield put(getFailure(error?.response?.message || error));
    }
}


function* postRequest(action) {
    try {
        const currentBranch = yield select(state => state.branch.currentBranch);
        const requestDetail = {
            method: "POST",
            headers: {
                "Authorization": localStorage.getItem("item"),
                "Content-Type": "application/json",
                "X-Current-Branch": currentBranch.id

            },
            body: JSON.stringify(action.payload)
        };
        const response = yield call(requestHandler, `${process.env.REACT_APP_SERVER_API}api/postInvoice`, requestDetail);
        yield put(postSuccess(response));
    } catch (error) {
        yield put(postFailure(error?.response?.message || error));
    }
}


function* putRequest(action) {
    try {
        const currentBranch = yield select(state => state.branch.currentBranch);
        const requestDetail = {
            method: "PUT",
            headers: {
                "Authorization": localStorage.getItem("item"),
                "Content-Type": "application/json",
                "X-Current-Branch": currentBranch.id
            },
            body: JSON.stringify(action.payload)
        };
        const response = yield call(requestHandler, `${process.env.REACT_APP_SERVER_API}api/updateInvoice`, requestDetail);
        yield put(putSuccess(response));
    } catch (error) {
        yield put(putFailure(error?.response?.message || error));
    }
}

function* saga() {
    yield takeLatest('invoice/getRequest', getRequest);
    yield takeLatest('invoice/postRequest', postRequest);
    yield takeLatest('invoice/putRequest', putRequest);
}

export default saga;