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
    name: 'patientLifeStyle',
    initialState,
    reducers: {
        postPatientLifeStyleRequest: (state) => {
            state.loading = true;
        },
        postPatientLifeStyleSuccess: (state, action) => {
            state.loading = false;
            state.postRes = action.payload;
        },
        postPatientLifeStyleFailure: (state, action) => {
            state.loading = false;
            state.postRes = action.payload;
        },
        resetPostPatientLifeStyle: (state) => {
            state.postRes = null;
        },
        putPatientLifeStyleRequest: (state) => {
            state.loading = true;
        },
        putPatientLifeStyleSuccess: (state, action) => {
            state.loading = false;
            state.putRes = action.payload;
        },
        putPatientLifeStyleFailure: (state, action) => {
            state.loading = false;
            state.putRes = action.payload;
        },
        resetPutPatientLifeStyle: (state) => {
            state.putRes = null;
        }
    }
});

export const { postPatientLifeStyleRequest, postPatientLifeStyleSuccess, postPatientLifeStyleFailure, resetPostPatientLifeStyle, putPatientLifeStyleRequest, putPatientLifeStyleSuccess, putPatientLifeStyleFailure, resetPutPatientLifeStyle } = slice.actions;

export default slice.reducer;