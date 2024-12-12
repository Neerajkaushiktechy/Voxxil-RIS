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
    name: 'patientPhysician',
    initialState,
    reducers: {
        postPatientPhysicianRequest: (state) => {
            state.loading = true;
        },
        postPatientPhysicianSuccess: (state, action) => {
            state.loading = false;
            state.postRes = action.payload;
        },
        postPatientPhysicianFailure: (state, action) => {
            state.loading = false;
            state.postRes = action.payload;
        },
        resetPostPatientPhysician: (state) => {
            state.postRes = null;
        },
        putPatientPhysicianRequest: (state) => {
            state.loading = true;
        },
        putPatientPhysicianSuccess: (state, action) => {
            state.loading = false;
            state.putRes = action.payload;
        },
        putPatientPhysicianFailure: (state, action) => {
            state.loading = false;
            state.putRes = action.payload;
        },
        resetPutPatientPhysician: (state) => {
            state.putRes = null;
        }
    }
});

export const { postPatientPhysicianRequest, postPatientPhysicianSuccess, postPatientPhysicianFailure, resetPostPatientPhysician, putPatientPhysicianRequest, putPatientPhysicianSuccess, putPatientPhysicianFailure, resetPutPatientPhysician } = slice.actions;

export default slice.reducer;