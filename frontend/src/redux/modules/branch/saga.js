import { takeLatest, call, put } from 'redux-saga/effects';
import { currentBranch, getSuccess, getFailure, postSuccess, postFailure, deleteSuccess, deleteFailure, putSuccess, putFailure, getReferralBranchSuccess,  getReferralBranchFailure } from './slice';
import requestHandler from '../../../utils/requestHandler';
import { logoutRequest } from '../auth/authSlice';

function* getRequest() {
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
        const response = yield call(requestHandler, `${process.env.REACT_APP_SERVER_API}api/branch`, requestDetail);
        if (response?.data?.length > 0) {
            let defaultBranch = JSON.parse(sessionStorage.getItem('defaultBranch')||'{}');
            if(defaultBranch && !defaultBranch?.id){
                defaultBranch = { name: response.data[0].name, id: response.data[0]._id };
            }
            yield put(currentBranch(defaultBranch));
        }
        yield put(getSuccess(response));
    } catch (error) {
        yield put(getFailure(error?.response?.message || error));
    }
}
function* postRequest(action) {
    try {
        const requestDetail = {
            method: "POST",
            headers: {
                "Authorization": localStorage.getItem("item"),
                "Content-Type": "application/json"
            },
            body: JSON.stringify(action.payload)
        };
        const response = yield call(requestHandler, `${process.env.REACT_APP_SERVER_API}api/branch`, requestDetail);
        yield put(postSuccess(response));
    } catch (error) {
        yield put(postFailure(error?.response?.message || error));
    }
}

function* deleteRequest(action) {
    try {
        const requestDetail = {
            method: "DELETE",
            headers: {
                "Authorization": localStorage.getItem("item"),
                "Content-Type": "application/json"
            }
        };
        const response = yield call(requestHandler, `${process.env.REACT_APP_SERVER_API}api/branch/${action.payload}`, requestDetail);
        yield put(deleteSuccess(response));
    } catch (error) {
        yield put(deleteFailure(error?.response?.message || error));
    }
}

function* putRequest(action) {
    try {
        const requestDetail = {
            method: "PUT",
            headers: {
                "Authorization": localStorage.getItem("item"),
                "Content-Type": "application/json"
            },
            body: JSON.stringify(action.payload)
        };
        const response = yield call(requestHandler, `${process.env.REACT_APP_SERVER_API}api/branch`, requestDetail);
        yield put(putSuccess(response));
    } catch (error) {
        yield put(putFailure(error?.response?.message || error));
    }
}

function* getReferralBranch() {
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
        const response = yield call(requestHandler, `${process.env.REACT_APP_SERVER_API}api/referral-branch`, requestDetail);
        yield put(getReferralBranchSuccess(response?.data));
    } catch (error) {
        yield put(getReferralBranchFailure(error?.response?.message || error));
    }
}


function* saga() {
    yield takeLatest('branch/getRequest', getRequest);
    yield takeLatest('branch/postRequest', postRequest);
    yield takeLatest('branch/deleteRequest', deleteRequest);
    yield takeLatest('branch/putRequest', putRequest);
    yield takeLatest('branch/getReferralBranch', getReferralBranch);
}

export default saga;