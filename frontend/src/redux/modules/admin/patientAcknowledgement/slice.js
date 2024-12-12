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
    name: 'patientAcknowledgement',
    initialState,
    reducers: {
        postPatientAcknowledgementRequest: (state) => {
            state.loading = true;
        },
        postPatientAcknowledgementSuccess: (state, action) => {
            state.loading = false;
            state.postRes = action.payload;
        },
        postPatientAcknowledgementFailure: (state, action) => {
            state.loading = false;
            state.postRes = action.payload;
        },
        resetPostPatientAcknowledgement: (state) => {
            state.postRes = null;
        },
        putPatientAcknowledgementRequest: (state) => {
            state.loading = true;
        },
        putPatientAcknowledgementSuccess: (state, action) => {
            state.loading = false;
            state.putRes = action.payload;
        },
        putPatientAcknowledgementFailure: (state, action) => {
            state.loading = false;
            state.putRes = action.payload;
        },
        resetPutPatientAcknowledgement: (state) => {
            state.putRes = null;
        }
    }
});

export const { postPatientAcknowledgementRequest, postPatientAcknowledgementSuccess, postPatientAcknowledgementFailure, resetPostPatientAcknowledgement, putPatientAcknowledgementRequest, putPatientAcknowledgementSuccess, putPatientAcknowledgementFailure, resetPutPatientAcknowledgement } = slice.actions;

export default slice.reducer;