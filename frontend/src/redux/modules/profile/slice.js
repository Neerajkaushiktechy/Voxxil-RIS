import { createSlice } from '@reduxjs/toolkit';

let initialState = {
    loading: false,
    getRes : null,
    putRes : null,
    getPatientRes:null,
    putPasswordRes : null
};

const slice = createSlice({
    name: 'profile',
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

        putPasswordRequest: (state) => {
            state.loading = true;
        },
        putPasswordSuccess: (state, action) => {
            state.loading = false;
            state.putPasswordRes = action.payload;
        },
        putPasswordFailure: (state, action) => {
            state.loading = false;
            state.putPasswordRes = action.payload;
        },
        resetPasswordPut: (state) => {
            state.putPasswordRes = null;
        },
        getPatientRequest: (state) => {
            state.loading = true;
        },
        getPatientSuccess: (state, action) => {
            state.loading = false;
            state.getPatientRes = action.payload;
        },
        getPatientFailure: (state, action) => {
            state.loading = false;
            state.getPatientRes = action.payload;
        },
        resetGetPatient: (state) => {
            state.getPatientRes = null;
        }
    }
});


export const {getRequest, getSuccess, getFailure,resetGet,  putRequest, putSuccess, putFailure,resetPut,putPasswordRequest,putPasswordSuccess,putPasswordFailure,resetPasswordPut,getPatientRequest,getPatientSuccess,getPatientFailure,resetGetPatient } = slice.actions;

export default slice.reducer;