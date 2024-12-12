import { createSlice } from '@reduxjs/toolkit';

let initialState = {
    loading: false,
    getPatientRes: null,
    getIdRes: null,
    radiologyAppoinmentId: null,
    showRadiologyForm: false,
    addPatientRes: false,
    success:null,
    errMesg:null,
    successMsg: null
};

const slice = createSlice({
    name: 'referral',
    initialState,
    reducers: {
        getRequest: (state) => {
            state.loading = true;
        },
        getSuccess: (state, action) => {
            state.loading = false;
            state.getRes = action.payload;
        },
        getFailure: (state, action) => {
            state.loading = false;
            state.getRes = action.payload;
        },
        postRequest: (state) => {
            state.loading = true;
        },
        postSuccess: (state, action) => {
            state.loading = false;
            state.postRes = action.payload;
        },
        resetPost: (state) => {
            state.postRes = null;
        },
        postFailure: (state, action) => {
            state.loading = false;
            state.postRes = action.payload;
        },
        deleteRequest: (state) => {
            state.loading = true;
        },
        deleteSuccess: (state, action) => {
            state.loading = false;
            state.deleteRes = action.payload;
        },
        deleteFailure: (state, action) => {
            state.loading = false;
            state.deleteRes = action.payload;
        },
        resetDelete: (state) => {
            state.deleteRes = null;
        },
        putRequest: (state) => {
            state.loading = true;
        },
        putSuccess: (state, action) => {
            state.loading = false;
            state.putRes = action.payload;
        },
        putFailure: (state, action) => {
            state.loading = false;
            state.putRes = action.payload;
        },
        resetPut: (state) => {
            state.putRes = null;
        },
        getReferralList: (state) => {
            state.loading = true;
        },
        getReferralListSuccess: (state, action) => {
            state.loading = false;
            state.referralList = action.payload;
        },
        getReferralListFailure: (state, action) => {
            state.loading = false;
            state.referralList = null;
        },
        createReferralOrder: (state) => {
            state.loading = true;

        },
        createReferralOrderSuccess: (state, action) => {
            state.loading = false;
            state.success = true;
        },
        createReferralOrderFailure: (state, action) => {
            state.loading = false;
            state.success = false;
            state.errMesg = action.payload;
        },
        resetSuccessErrorMessage: (state) => {
            state.success = null;
            state.errMesg = null;
            state.successMsg = null;
        },
        declienReferralOrder: (state, action) => {
            state.loading = true;
        },
        declineReferralSuccess: (state, action) => {
            state.loading = false;
            state.success = true;
            state.successMsg = 'Order Declined successful'
        },
        declineReferralFailure: (state, action) => {
            state.loading = false;
            state.success = false;
            state.errMesg = action.payload;
        }
    }
});

export const { getRequest, getSuccess, getFailure, resetGet, postRequest, postSuccess, postFailure, resetPost, deleteRequest, deleteSuccess, deleteFailure, resetDelete, putRequest, putSuccess, putFailure, resetPut,
    getReferralList,
    getReferralListSuccess,
    getReferralListFailure,
    createReferralOrder,
    createReferralOrderSuccess,
    createReferralOrderFailure,
    resetSuccessErrorMessage,
    declienReferralOrder,
    declineReferralSuccess,
    declineReferralFailure
} = slice.actions;

export default slice.reducer;