import { takeLatest, call, put, select } from 'redux-saga/effects';
import requestHandler from '../../../utils/requestHandler';
import { logoutRequest } from '../auth/authSlice';
import { 
    getModalitiesSuccess,
    getModalitiesFailure,
    resetGetModalityGroup,
    deleteModalityListSuccess,
    deleteModalityListFailure,
    postModalityListSuccess,
    postModalityListFailure,
    putModalityListSuccess,
    putModalityListFailure
} from './slice'

function* getModalityListRequest(action) {
    try {
        console.log('action payload', action)
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
        const response = yield call(requestHandler, `${process.env.REACT_APP_SERVER_API}api/modality?page=${page}&limit=${limit}&searchQuery=${searchQuery}`, requestDetail);

        yield put(getModalitiesSuccess(response));
    } catch (error) {
        yield put(getModalitiesFailure(error?.response?.message || error));
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
        const response = yield call(requestHandler, `${process.env.REACT_APP_SERVER_API}api/modality`, requestDetail);
        yield put(postModalityListSuccess(response));
    } catch (error) {
        yield put(postModalityListFailure(error?.response?.message || error));
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
        const response = yield call(requestHandler, `${process.env.REACT_APP_SERVER_API}api/modality`, requestDetail);
        yield put(putModalityListSuccess(response));
    } catch (error) {
        yield put(putModalityListFailure(error?.response?.message || error));
    }
}

function* deleteModalityListRequest(action) {
    try {
        const requestDetail = {
            method: "DELETE",
            headers: {
                "Authorization": localStorage.getItem("item"),
                "Content-Type": "application/json"
            }
        };
        const response = yield call(requestHandler, `${process.env.REACT_APP_SERVER_API}api/modality/${action.payload}`, requestDetail);
        yield put(deleteModalityListSuccess(response));
    } catch (error) {
        yield put(deleteModalityListFailure(error?.response?.message || error));
    }
}

function* saga() {
    yield takeLatest('modalities/getModalityListRequest', getModalityListRequest);
    yield takeLatest('modalities/postModalityListRequest', postListRequest)
    yield takeLatest('modalities/putModalityListRequest', putListRequest);
    yield takeLatest('modalities/deleteModalityListRequest', deleteModalityListRequest);

}

export default saga;
