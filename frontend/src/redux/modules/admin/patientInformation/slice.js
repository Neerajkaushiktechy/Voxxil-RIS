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
    name: 'patientInformation',
    initialState,
    reducers: {
        postPatientInformationRequest: (state) => {
            state.loading = true;
        },
        postPatientInformationSuccess: (state, action) => {
            state.loading = false;
            state.postRes = action.payload;
        },
        postPatientInformationFailure: (state, action) => {
            state.loading = false;
            state.postRes = action.payload;
        },
        resetPostPatientInformation: (state) => {
            state.postRes = null;
        },
        putPatientInformationRequest: (state) => {
            state.loading = true;
        },
        putPatientInformationSuccess: (state, action) => {
            state.loading = false;
            state.putRes = action.payload;
        },
        putPatientInformationFailure: (state, action) => {
            state.loading = false;
            state.putRes = action.payload;
        },
        resetPut: (state) => {
            state.putRes = null;
        }
    }
});

export const { postPatientInformationRequest, postPatientInformationSuccess, postPatientInformationFailure, resetPostPatientInformation, putPatientInformationRequest, putPatientInformationSuccess, putPatientInformationFailure, resetPut } = slice.actions;

export default slice.reducer;