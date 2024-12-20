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
    name: 'patientInsurance',
    initialState,
    reducers: {
        postPatientInsuranceRequest: (state) => {
            state.loading = true;
        },
        postPatientInsuranceSuccess: (state, action) => {
            state.loading = false;
            state.postRes = action.payload;
        },
        postPatientInsuranceFailure: (state, action) => {
            state.loading = false;
            state.postRes = action.payload;
        },
        resetPostPatientInsurance: (state) => {
            state.postRes = null;
        },
        putPatientInsuranceRequest: (state) => {
            state.loading = true;
        },
        putPatientInsuranceSuccess: (state, action) => {
            state.loading = false;
            state.putRes = action.payload;
        },
        putPatientInsuranceFailure: (state, action) => {
            state.loading = false;
            state.putRes = action.payload;
        },
        resetPutPatientInsurance: (state) => {
            state.putRes = null;
        }
    }
});

export const { postPatientInsuranceRequest, postPatientInsuranceSuccess, postPatientInsuranceFailure, resetPostPatientInsurance, putPatientInsuranceRequest, putPatientInsuranceSuccess, putPatientInsuranceFailure, resetPutPatientInsurance } = slice.actions;

export default slice.reducer;