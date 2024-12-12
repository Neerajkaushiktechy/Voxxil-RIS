import { select, takeLatest, call, put } from 'redux-saga/effects';
import { appointerSignSuccess,appointerSignFail } from './slice';
import requestHandler from '../../../utils/requestHandler';
import { logoutRequest } from '../auth/authSlice';

function* appointerSign(action) {
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
        const response = yield call(requestHandler, `${process.env.REACT_APP_SERVER_API}api/appointer-signature`, requestDetail);
        yield put(appointerSignSuccess(response));
    } catch (error) {
        yield put(appointerSignFail(error?.response?.message || error));
    }
}

function* saga() {
    yield takeLatest('signature/postAppointerSign', appointerSign);
}

export default saga;