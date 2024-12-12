import { select, takeLatest, call, put } from 'redux-saga/effects';
import { getSuccess, getFailure } from './slice';
import requestHandler from '../../../utils/requestHandler';
import { logoutRequest } from '../auth/authSlice';

function* getRequest() {
    try {
        let authToken = localStorage.getItem("item");
        if (!authToken) {
            yield put(logoutRequest());
            return;
        }
        const currentBranch = yield select(state => state?.branch?.currentBranch);
        const requestDetail = {
            method: "GET",
            headers: {
                "Authorization": authToken,
                "Content-Type": "application/json",
                "X-Current-Branch": currentBranch.id
            }
        };

        const response = yield call(requestHandler, `${process.env.REACT_APP_SERVER_API}api/appointment`, requestDetail);
        yield put(getSuccess(response));
    } catch (error) {
        yield put(getFailure(error?.response?.message || error));
    }
}


function* saga() {
    yield takeLatest('appointment/getRequest', getRequest);
}

export default saga;