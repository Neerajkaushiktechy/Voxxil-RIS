import { createSlice } from '@reduxjs/toolkit';

let initialState = {
    loading: false,
    getRes: null,
    postRes: null,
    getInfoRes: null,
    putRes: null,
    deleteRes: null,
    getMasterRes: null,
    getPatientDataRes: null,
};

const slice = createSlice({
    name: 'patientProfile',
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
        getPatientProfileRequest: (state) => {
            state.loading = true;
        },
        getPatientProfileSuccess: (state, action) => {
            state.loading = false;
            state.getInfoRes = action.payload;
        },
        getPatientProfileFailure: (state, action) => {
            state.loading = false;
            state.getInfoRes = action.payload;
        },
        deletePatientProfileRequest: (state) => {
            state.loading = true;
        },
        deletePatientProfileSuccess: (state, action) => {
            state.loading = false;
            state.deleteRes = action.payload;
        },
        deletePatientProfileFailure: (state, action) => {
            state.loading = false;
            state.deleteRes = action.payload;
        },
        resetDelete: (state) => {
            state.deleteRes = null;
        },
        getPatientDataRequest: (state) => {
            state.loading = true;
        },
        getPatientDataSuccess: (state, action) => {
            state.loading = false;
            state.getPatientDataRes = action.payload;
        },
        getPatientDataFailure: (state, action) => {
            state.loading = false;
            state.getPatientDataRes = action.payload;
        },
        resetPatientData: (state) => {
            state.getPatientDataRes = null;
        },
    }
});

export const { getMasterDataRequest, getMasterDataSuccess, getMasterDataFailure, postPatientProfileRequest, postPatientProfileSuccess, postPatientProfileFailure, resetPostPatientProfile, getPatientProfileRequest, getPatientProfileSuccess, getPatientProfileFailure, deletePatientProfileRequest, deletePatientProfileSuccess, deletePatientProfileFailure, resetDelete, getPatientDataRequest, getPatientDataSuccess, getPatientDataFailure, resetPatientData } = slice.actions;

export default slice.reducer;