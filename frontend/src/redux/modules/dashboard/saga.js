import { takeLatest, call, put, select } from 'redux-saga/effects';
import { getSuccess, getFailure, getdeclineReferralListSuccess, getdeclineReferralListFailure, getPatientDashboardDataSuccess, getPatientDashboardDataFailure} from './slice';
import requestHandler from '../../../utils/requestHandler';
import { logoutRequest } from '../auth/authSlice';

function* getRequest() {
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
        const response = yield call(requestHandler, `${process.env.REACT_APP_SERVER_API}api/allAppointments`, requestDetail);
        yield put(getSuccess(response));
    } catch (error) {
        yield put(getFailure(error?.response?.message || error));
    }
}

function* getdeclineReferralList() {
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
        const response = yield call(requestHandler, `${process.env.REACT_APP_SERVER_API}admin/api/get-decline-list`, requestDetail);
        yield put(getdeclineReferralListSuccess(response));
    } catch (error) {
        yield put(getdeclineReferralListFailure(error?.response?.message || error));
    }
}

function* getPatientDashboardData(action) {
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
        const response = yield call(requestHandler, `${process.env.REACT_APP_SERVER_API}patient/api/dashboard`, requestDetail);
        yield put(getPatientDashboardDataSuccess(response.data));
    } catch (error) {
        yield put(getPatientDashboardDataFailure(error?.response?.message || error));
    }
}


function* saga() {
    yield takeLatest('dashboard/getRequest', getRequest);
    yield takeLatest('dashboard/getdeclineReferralList', getdeclineReferralList);
    yield takeLatest('dashboard/getPatientDashboardData', getPatientDashboardData)
}

export default saga;