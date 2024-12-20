import { createSlice } from '@reduxjs/toolkit';

let initialState = {
    loading: false,
    getRes: null,
    postRes: null,
    getInfoRes: null,
    putRes: null,
    deleteRes: null,
    getMasterRes: null,
};

const slice = createSlice({
    name: 'patientMedicalHistory',
    initialState,
    reducers: {
        postPatientMedicalHistoryRequest: (state) => {
            state.loading = true;
        },
        postPatientMedicalHistorySuccess: (state, action) => {
            state.loading = false;
            state.postRes = action.payload;
        },
        postPatientMedicalHistoryFailure: (state, action) => {
            state.loading = false;
            state.postRes = action.payload;
        },
        resetPostPatientMedicalHistory: (state) => {
            state.postRes = null;
        },
        getPatientMedicalHistoryRequest: (state) => {
            state.loading = true;
        },
        getPatientMedicalHistorySuccess: (state, action) => {
            state.loading = false;
            state.getInfoRes = action.payload;
        },
        getPatientMedicalHistoryFailure: (state, action) => {
            state.loading = false;
            state.getInfoRes = action.payload;
        },
        putPatientMedicalHistoryRequest: (state) => {
            state.loading = true;
        },
        putPatientMedicalHistorySuccess: (state, action) => {
            state.loading = false;
            state.putRes = action.payload;
        },
        putPatientMedicalHistoryFailure: (state, action) => {
            state.loading = false;
            state.putRes = action.payload;
        },
        resetPutMedicalHistory: (state) => {
            state.putRes = null;
        }
    }
});

export const { postPatientMedicalHistoryRequest, postPatientMedicalHistorySuccess, postPatientMedicalHistoryFailure, resetPostPatientMedicalHistory, getPatientMedicalHistoryRequest, getPatientMedicalHistorySuccess, getPatientMedicalHistoryFailure, putPatientMedicalHistoryRequest, putPatientMedicalHistorySuccess, putPatientMedicalHistoryFailure, resetPutMedicalHistory } = slice.actions;

export default slice.reducer;