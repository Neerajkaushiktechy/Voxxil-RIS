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
    name: 'patientRegistration',
    initialState,
    reducers: {
        getMasterDataRequest: (state) => {
            state.loading = true;
        },
        getMasterDataSuccess: (state, action) => {
            state.loading = false;
            state.getMasterRes = action.payload;
        },
        getMasterDataFailure: (state, action) => {
            state.loading = false;
            state.getMasterRes = action.payload;
        },
        postPatientRegistrationRequest: (state) => {
            state.loading = true;
        },
        postPatientRegistrationSuccess: (state, action) => {
            state.loading = false;
            state.postRes = action.payload;
        },
        postPatientRegistrationFailure: (state, action) => {
            state.loading = false;
            state.postRes = action.payload;
        },
        resetPostPatientRegistration: (state) => {
            state.postRes = null;
        },
        getPatientInformationRequest: (state) => {
            state.loading = true;
        },
        getPatientInformationSuccess: (state, action) => {
            state.loading = false;
            state.getInfoRes = action.payload;
        },
        getPatientInformationFailure: (state, action) => {
            state.loading = false;
            state.getInfoRes = action.payload;
        },
        deletePatientInformationRequest: (state) => {
            state.loading = true;
        },
        deletePatientInformationSuccess: (state, action) => {
            state.loading = false;
            state.deleteRes = action.payload;
        },
        deletePatientInformationFailure: (state, action) => {
            state.loading = false;
            state.deleteRes = action.payload;
        },
        resetDelete: (state) => {
            state.deleteRes = null;
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

export const { getMasterDataRequest, getMasterDataSuccess, getMasterDataFailure, postPatientRegistrationRequest, postPatientRegistrationSuccess, postPatientRegistrationFailure, resetPostPatientRegistration, getPatientInformationRequest, getPatientInformationSuccess, getPatientInformationFailure, deletePatientInformationRequest, deletePatientInformationSuccess, deletePatientInformationFailure, resetDelete, putPatientInformationRequest, putPatientInformationSuccess, putPatientInformationFailure, resetPut } = slice.actions;

export default slice.reducer;