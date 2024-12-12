import { takeLatest, call, put, select } from 'redux-saga/effects';
import { postExamGroupSuccess, postExamGroupFailure, postExamListSuccess, postExamListFailure, getExamGroupSuccess, getExamGroupFailure, getExamListSuccess, getExamListFailure, putExamListSuccess, putExamListFailure, deleteExamListSuccess, deleteExamListFailure, putExamGroupSuccess, putExamGroupFailure, deleteExamGroupSuccess, deleteExamGroupFailure, getExamGroupIdSuccess, getExamGroupIdFailure } from './slice';
import requestHandler from '../../../utils/requestHandler';
import { logoutRequest } from '../auth/authSlice';


function* postGroupRequest(action) {
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
        const response = yield call(requestHandler, `${process.env.REACT_APP_SERVER_API}api/exam-group`, requestDetail);
        yield put(postExamGroupSuccess(response));
    } catch (error) {
        yield put(postExamGroupFailure(error?.response?.message || error));
    }
}

function* getExamGroupIdRequest(action) {
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
        const response = yield call(requestHandler, `${process.env.REACT_APP_SERVER_API}api/exam-group-id?dataQuery=${JSON.stringify(action.payload)}`, requestDetail);

        yield put(getExamGroupIdSuccess(response));
    } catch (error) {
        yield put(getExamGroupIdFailure(error?.response?.message || error));
    }
}


function* getGroupRequest(action) {
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
        const response = yield call(requestHandler, `${process.env.REACT_APP_SERVER_API}api/exam-group?page=${page}&limit=${limit}&searchQuery=${searchQuery}`, requestDetail);
        yield put(getExamGroupSuccess(response));
    } catch (error) {
        yield put(getExamGroupFailure(error?.response?.message || error));
    }
}

function* putGroupRequest(action) {
    try {
        const requestDetail = {
            method: "PUT",
            headers: {
                "Authorization": localStorage.getItem("item"),
                "Content-Type": "application/json"
            },
            body: JSON.stringify(action.payload)
        };
        const response = yield call(requestHandler, `${process.env.REACT_APP_SERVER_API}api/exam-group`, requestDetail);
        yield put(putExamGroupSuccess(response));
    } catch (error) {
        yield put(putExamGroupFailure(error?.response?.message || error));
    }
}

function* deleteGroupRequest(action) {
    try {
        const requestDetail = {
            method: "DELETE",
            headers: {
                "Authorization": localStorage.getItem("item"),
                "Content-Type": "application/json"
            }
        };
        const response = yield call(requestHandler, `${process.env.REACT_APP_SERVER_API}api/exam-group/${action.payload}`, requestDetail);
        yield put(deleteExamGroupSuccess(response));
    } catch (error) {
        yield put(deleteExamGroupFailure(error?.response?.message || error));
    }
}


function* postListRequest(action) {
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
        const response = yield call(requestHandler, `${process.env.REACT_APP_SERVER_API}api/exam-list`, requestDetail);
        yield put(postExamListSuccess(response));
    } catch (error) {
        yield put(postExamListFailure(error?.response?.message || error));
    }
}


function* getListRequest(action) {
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
        const response = yield call(requestHandler, `${process.env.REACT_APP_SERVER_API}api/exam-list?page=${page}&limit=${limit}&searchQuery=${searchQuery}`, requestDetail);
        yield put(getExamListSuccess(response));
    } catch (error) {
        console.log(error)
        yield put(getExamListFailure(error?.response?.message || error));
    }
}


function* putListRequest(action) {
    try {
        const requestDetail = {
            method: "PUT",
            headers: {
                "Authorization": localStorage.getItem("item"),
                "Content-Type": "application/json"
            },
            body: JSON.stringify(action.payload)
        };
        const response = yield call(requestHandler, `${process.env.REACT_APP_SERVER_API}api/exam-list`, requestDetail);
        yield put(putExamListSuccess(response));
    } catch (error) {
        yield put(putExamListFailure(error?.response?.message || error));
    }
}


function* deleteListRequest(action) {
    try {
        const requestDetail = {
            method: "DELETE",
            headers: {
                "Authorization": localStorage.getItem("item"),
                "Content-Type": "application/json"
            }
        };
        const response = yield call(requestHandler, `${process.env.REACT_APP_SERVER_API}api/exam-list/${action.payload}`, requestDetail);
        yield put(deleteExamListSuccess(response));
    } catch (error) {
        yield put(deleteExamListFailure(error?.response?.message || error));
    }
}


function* saga() {
    yield takeLatest('exam/postExamGroupRequest', postGroupRequest);
    yield takeLatest('exam/getExamGroupIdRequest', getExamGroupIdRequest);
    yield takeLatest('exam/getExamGroupRequest', getGroupRequest);
    yield takeLatest('exam/putExamGroupRequest', putGroupRequest);
    yield takeLatest('exam/deleteExamGroupRequest', deleteGroupRequest);

    yield takeLatest('exam/postExamListRequest', postListRequest);
    yield takeLatest('exam/getExamListRequest', getListRequest);
    yield takeLatest('exam/putExamListRequest', putListRequest);
    yield takeLatest('exam/deleteExamListRequest', deleteListRequest);
}

export default saga;