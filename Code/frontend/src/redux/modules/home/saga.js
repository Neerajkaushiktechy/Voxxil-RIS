import { takeLatest, call, put } from 'redux-saga/effects';
import {  postSuccess, postFailure } from './slice';
import requestHandler from '../../../utils/requestHandler';


function* postRequest(action) {
    try {
        const requestDetail = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(action.payload)
        };
        const response = yield call(requestHandler, `${process.env.REACT_APP_SERVER_API}api/enquiry`, requestDetail);
        yield put(postSuccess(response));
    } catch (error) {
        yield put(postFailure(error?.response?.message || error));
    }
}


function* saga() {
    yield takeLatest('enquiry/postRequest', postRequest);
}

export default saga;