import { select, takeLatest, call, put } from 'redux-saga/effects';
import { getSuccess, getFailure, postSuccess, postFailure, getSuccessUserList, getFailureUserList, deleteUserSuccess, deleteUserFailure, putUserFailure, putUserSuccess, getStaffListSuccess, getStaffListFailure } from './slice';
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
        const response = yield call(requestHandler, `${process.env.REACT_APP_SERVER_API}api/staff?name=${action.payload}`, requestDetail);
        yield put(getSuccess(response));
    } catch (error) {
        yield put(getFailure(error?.response?.message || error));
    }
}

function* getRequestUserList(action) {
    try {
        let authToken = localStorage.getItem("item")
        if (!authToken) {
            yield put(logoutRequest());
            return; // Exit the generator if no authentication token is found
        }
        const { page, limit, searchQuery } = action.payload || { page: 1, limit: null, searchQuery: "" };
        const currentBranch = yield select(state => state.branch.currentBranch);
        const requestDetail = {
            method: "GET",
            headers: {
                "Authorization": authToken,
                "Content-Type": "application/json",
                "X-Current-Branch": currentBranch.id
            }
        };
        const response = yield call(requestHandler, `${process.env.REACT_APP_SERVER_API}api/userlist?page=${page}&limit=${limit}&searchQuery=${searchQuery}`, requestDetail);
        yield put(getSuccessUserList(response));
    } catch (error) {
        yield put(getFailureUserList(error?.response?.message || error));
    }
}



function* postRequest(action) {
    try {
        let authToken = localStorage.getItem("item")
        if (!authToken) {
            yield put(logoutRequest());
            return; 
        }
        const currentBranch = yield select(state => state.branch.currentBranch);
        const requestDetail = {
            method: "POST",
            headers: {
                "Authorization": authToken,
                "X-Current-Branch": currentBranch.id
            },
            body: action.payload
        };

        const response = yield call(requestHandler, `${process.env.REACT_APP_SERVER_API}api/user`, requestDetail);
        yield put(postSuccess(response));
    } catch (error) {
        yield put(postFailure(error?.response?.message || error));
    }
}


function* deleteUserRequest(action) {
    try {
        let authToken = localStorage.getItem("item");
        if (!authToken) {
            yield put(logoutRequest());
            return; 
        }
        const currentBranch = yield select(state => state.branch.currentBranch);

        const requestDetail = {
            method: "DELETE",
            headers: {
                "Authorization": authToken,
                "X-Current-Branch": currentBranch.id
                // "Content-Type": "application/json"
            }
        };
        const response = yield call(requestHandler, `${process.env.REACT_APP_SERVER_API}api/user/${action.payload}`, requestDetail);
        yield put(deleteUserSuccess(response));
    } catch (error) {
        yield put(deleteUserFailure(error?.response?.message || error));
    }
}

function* putUserRequest(action) {
    try {
        let authToken = localStorage.getItem("item");
        if (!authToken) {
            yield put(logoutRequest());
            return; 
        }
        const currentBranch = yield select(state => state.branch.currentBranch);
        const requestDetail = {
            method: "PUT",
            headers: {
                "Authorization": authToken,
                "X-Current-Branch": currentBranch.id
            },
            body: action.payload
        };
        const response = yield call(requestHandler, `${process.env.REACT_APP_SERVER_API}api/user`, requestDetail);
        yield put(putUserSuccess(response));
    } catch (error) {
        yield put(putUserFailure(error?.response?.message || error));
    }
}

function* getStaffList(action) {
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
        const response = yield call(requestHandler, `${process.env.REACT_APP_SERVER_API}api/saff-list`, requestDetail);
        yield put(getStaffListSuccess(response));
    } catch (error) {
        yield put(getStaffListFailure(error?.response?.message || error));
    }
}

function* saga() {
    yield takeLatest('staff/getRequest', getRequest);
    yield takeLatest('staff/deleteUserRequest', deleteUserRequest);
    yield takeLatest('staff/getRequestUserList', getRequestUserList);
    yield takeLatest('staff/postRequest', postRequest);
    yield takeLatest('staff/putUserRequest', putUserRequest);
    yield takeLatest('staff/getStaffList', getStaffList);
    
}

export default saga;