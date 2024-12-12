import { createSlice } from '@reduxjs/toolkit';

let initialState = {
    loading: false,
    getRes: null,
    getIdRes: null,
    getPatientOrders: null,
};

const slice = createSlice({
    name: 'orders',
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

        getIdRequest: (state) => {
            state.loading = true;
        },
        getIdSuccess: (state, action) => {
            state.loading = false;
            state.getIdRes = action.payload;
        },
        getIdFailure: (state, action) => {
            state.loading = false;
            state.getIdRes = action.payload;
        },
        resetGetId: (state) => {
            state.getIdRes = null;
        },


        getPatientOrdersRequest: (state) => {
            state.loading = true;
        },
        getPatientOrdersSuccess: (state, action) => {
            state.loading = false;
            state.getPatientOrders = action.payload;
        },
        getPatientOrdersFailure: (state, action) => {
            state.loading = false;
            state.getPatientOrders = action.payload;
        },
        resetgetPatientOrders: (state) => {
            state.getPatientOrders = null;
        },

        putAppointmentStatusRequest: (state) => {
            state.loading = true;
        },
        putAppointmentStatusSuccess: (state, action) => {
            state.loading = false;
            state.putOrderStatus = action.payload;
        },
        putAppointmentStatusFailure: (state, action) => {
            state.loading = false;
            state.putOrderStatus = action.payload;
        },
        resetPutAppointmentStatus: (state) => {
            state.putOrderStatus = null;
        }
    }
});


export const { getRequest, getSuccess, getFailure, resetGet,
    getIdRequest,
    getIdSuccess,
    getIdFailure,
    resetGetId,
    getPatientOrdersRequest,
    getPatientOrdersSuccess,
    getPatientOrdersFailure,
    resetgetPatientOrders,

    putAppointmentStatusRequest,
    putAppointmentStatusSuccess,
    putAppointmentStatusFailure,
    resetPutAppointmentStatus
} = slice.actions;

export default slice.reducer;