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
    name: 'patientEmergencyContact',
    initialState,
    reducers: {
        postPatientEmergencyContactRequest: (state) => {
            state.loading = true;
        },
        postPatientEmergencyContactSuccess: (state, action) => {
            state.loading = false;
            state.postRes = action.payload;
        },
        postPatientEmergencyContactFailure: (state, action) => {
            state.loading = false;
            state.postRes = action.payload;
        },
        resetPostPatientEmergencyContact: (state) => {
            state.postRes = null;
        },
        putPatientEmergencyContactRequest: (state) => {
            state.loading = true;
        },
        putPatientEmergencyContactSuccess: (state, action) => {
            state.loading = false;
            state.putRes = action.payload;
        },
        putPatientEmergencyContactFailure: (state, action) => {
            state.loading = false;
            state.putRes = action.payload;
        },
        resetPut: (state) => {
            state.putRes = null;
        }
    }
});

export const { postPatientEmergencyContactRequest, postPatientEmergencyContactSuccess, postPatientEmergencyContactFailure, resetPostPatientEmergencyContact, putPatientEmergencyContactRequest, putPatientEmergencyContactSuccess, putPatientEmergencyContactFailure, resetPut } = slice.actions;

export default slice.reducer;