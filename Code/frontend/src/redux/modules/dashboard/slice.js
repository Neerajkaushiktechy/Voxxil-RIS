import { createSlice } from '@reduxjs/toolkit';

let initialState = {
    loading: false,
    getRes: null,
    declineReferral: [],
    patientDashboardData:{todayAppointments:[], declinedAppointments:[]}
};

const slice = createSlice({
    name: 'dashboard',
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
        getdeclineReferralList:(state) => {
            state.loading = true;
        },
        getdeclineReferralListSuccess:(state, action) => {
            state.loading = false;
            state.declineReferral =action.payload.data
        },
        getdeclineReferralListFailure:(state, action) => {
            state.loading = false;
            state.declineReferral =[]
        },
        getPatientDashboardData:(state) => {
            state.loading = true;
        },
        getPatientDashboardDataSuccess:(state, action) => {
            state.loading = false;
            state.patientDashboardData = action.payload
        },
        getPatientDashboardDataFailure:(state) => {
            state.loading = false;
            state.patientDashboardData = {todayAppointments:[], declinedAppointments:[]};
        }
    }
});

export const { getRequest, getSuccess, getFailure, resetGet, getdeclineReferralListSuccess, getdeclineReferralListFailure, getdeclineReferralList, getPatientDashboardData, getPatientDashboardDataSuccess, getPatientDashboardDataFailure } = slice.actions;

export default slice.reducer;