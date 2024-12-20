import { select, takeLatest, call, put } from 'redux-saga/effects';
import { postSuccess, postFailure, getReferralListSuccess, getReferralListFailure, createReferralOrderSuccess, createReferralOrderFailure, declineReferralSuccess, declineReferralFailure } from './slice';
import requestHandler from '../../../utils/requestHandler';
import { logoutRequest } from '../auth/authSlice';


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
        const response = yield call(requestHandler, `${process.env.REACT_APP_SERVER_API}api/referral`, requestDetail);
        yield put(postSuccess(response));
    } catch (error) {
        yield put(postFailure(error?.response?.message || error));
    }
}

function* getReferralList(action) {
    try {
        let authToken = localStorage.getItem("item")
        if (!authToken) {
            yield put(logoutRequest());
            return; // Exit the generator if no authentication token is found
        }
        const currentBranch = yield select(state => state.branch.currentBranch);
        const {searchBy, page, limit, searchQuery} = action.payload || { page: 1, limit: null, searchBy: "refeeredBy", searchQuery:"" };;
        const requestDetail = {
            method: "GET",
            headers: {
                "Authorization": authToken,
                "Content-Type": "application/json",
                "X-Current-Branch": currentBranch.id,
            }
        };
        const response = yield call(requestHandler, `${process.env.REACT_APP_SERVER_API}admin/api/get-referral-list/?page=${page}&limit=${limit}&searchBy=${searchBy}&searchQuery=${searchQuery}`, requestDetail);
        yield put(getReferralListSuccess(response));
    } catch (error) {
        yield put(getReferralListFailure(error?.response?.message || error));
    }
}

function* createReferralOrder(action) {
    try {
        let authToken = localStorage.getItem("item")
        if (!authToken) {
            yield put(logoutRequest());
            return; // Exit the generator if no authentication token is found
        }
        const currentBranch = yield select(state => state.branch.currentBranch);
        const requestDetail = {
            method: "PUT",
            headers: {
                "Authorization": authToken,
                "Content-Type": "application/json",
                "X-Current-Branch": currentBranch.id,
            },
            body: JSON.stringify({radiologyId: action.payload.radiologyId})
        };
        const response = yield call(requestHandler, `${process.env.REACT_APP_SERVER_API}admin/api/approve-referral`, requestDetail);
        yield put(createReferralOrderSuccess(response));
        if(response.success) {
            const {searchBy, page, limit} = action.payload || { page: 1, limit: null, searchBy: "refeeredBy" };;
            const requestDetail = {
                method: "GET",
                headers: {
                    "Authorization": authToken,
                    "Content-Type": "application/json",
                    "X-Current-Branch": currentBranch.id,
                }
            };
            const response = yield call(requestHandler, `${process.env.REACT_APP_SERVER_API}admin/api/get-referral-list/?page=${page}&limit=${limit}&searchBy=${searchBy}`, requestDetail);
            yield put(getReferralListSuccess(response));
        }
        
    } catch (error) {
        yield put(createReferralOrderFailure(error?.response?.message || error));
    }
}

function* declienReferralOrder(action) {
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
        const response = yield call(requestHandler, `${process.env.REACT_APP_SERVER_API}admin/api/decline-referral`, requestDetail);
        yield put(declineReferralSuccess(response));
    } catch (error) {
        yield put(declineReferralFailure(error?.response?.message || error));
    }
}


function* saga() {
    yield takeLatest('referral/postRequest', postRequest);
    yield takeLatest('referral/getReferralList', getReferralList);
    yield takeLatest('referral/declienReferralOrder', declienReferralOrder);
}

export default saga; 