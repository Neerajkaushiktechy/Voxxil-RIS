import { takeLatest, call, put } from 'redux-saga/effects';
import { getSuccess, getFailure, } from './slice';
import requestHandler from '../../../utils/requestHandler';
import { logoutRequest } from '../auth/authSlice';

function* getRequest(action) {
    console.log(action.payload, "paluyy")
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
        const response = yield call(requestHandler, `${process.env.REACT_APP_SERVER_API}api/getAnalyticsData/${action.payload.month}`, requestDetail);
        yield put(getSuccess(response));
    } catch (error) {
        yield put(getFailure(error?.response?.message || error));
    }
}


function* saga() {
    yield takeLatest('analytics/getRequest', getRequest);
}

export default saga;