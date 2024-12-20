import { createSlice } from '@reduxjs/toolkit';

let initialState = {
    loading: false,
    getPatientRes: null,
    postRes : null,
    deleteRes : null,
    deleteUserRes : null,
    getUserListRes:null,
    putUserRes : null,
    staffList:[]
};

const slice = createSlice({
    name: 'staff',
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
        resetGet: (state) => {
            state.getRes = null;
        },
        postRequest: (state) => { 
            state.loading = true;
        },
        postSuccess: (state, action) => {
            state.loading = false;
            state.postRes = action.payload;
        },
        postFailure: (state, action) => {
            state.loading = false;
            state.postRes = action.payload; 
        },
        resetPost: (state) => { 
            state.postRes = null;
        },
        deleteUserRequest: (state) => {
            state.loading = true;
        },
        deleteUserSuccess: (state, action) => {
            state.loading = false;
            state.deleteUserRes = action.payload;
        },
        deleteUserFailure: (state, action) => {
            state.loading = false;
            state.deleteUserRes = action.payload;
        },
        resetUserDelete: (state) => {
            state.deleteUserRes = null;
        },
        getRequestUserList: (state) => {
            state.loading = true;
        },
        getSuccessUserList: (state, action) => {
            state.loading = false;
            state.getUserListRes = action.payload;
        },
        getFailureUserList: (state, action) => {
            state.loading = false;
            state.getUserListRes = action.payload;
        },
        resetGetUserList: (state) => {
            state.getUserListRes = null;
        },
        putUserRequest: (state) => {
            state.loading = true;
        },
        putUserSuccess: (state, action) => {
            state.loading = false;
            state.putUserRes = action.payload;
        },
        putUserFailure: (state, action) => {
            state.loading = false;
            state.putUserRes = action.payload;
        },
        resetUserPut: (state) => {
            state.putUserRes = null;
        },
        getStaffList: (state) => {
            state.loading = true;
        },
        getStaffListSuccess: (state, action) => {
            state.loading = false;
            state.staffList = action.payload?.data;
        },
        getStaffListFailure: (state, action) => {
            state.loading = false;
            state.staffList = [];
        },

    }
});

export const { getRequest, getSuccess, getFailure, resetGet,getRequestUserList,getSuccessUserList,resetGetUserList,getFailureUserList,postRequest,postSuccess,postFailure, resetPost,deleteUserRequest,deleteUserSuccess,deleteUserFailure,resetUserDelete,putUserRequest,putUserSuccess,putUserFailure,resetUserPut, getStaffList, getStaffListSuccess, getStaffListFailure} = slice.actions;

export default slice.reducer;