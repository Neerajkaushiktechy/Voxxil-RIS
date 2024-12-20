import { createSlice } from '@reduxjs/toolkit';

let initialState = {
    loading: false,
    getPatientRes: null,
    getIdRes: null,
    radiologyAppoinmentId: null,
    showRadiologyForm: false,
    addPatientRes: false,
    referralList: null
};

const slice = createSlice({
    name: 'radiology',
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
        getIdRequest: (state) => {
            state.loading = true;
        },
        getIdSuccess: (state, action) => {
            state.loading = false;
            state.getIdRes = action.payload;
        },
        getIdFailure: (state, action) => {
            state.loading = false;
            state.getIdRes = action.payload;
        },
        resetIdGet: (state) => {
            state.getIdRes = null;
        },
        postRequest: (state) => {
            state.loading = true;
        },
        postSuccess: (state, action) => {
            state.loading = false;
            state.postRes = action.payload;
        },
        resetPost: (state) => {
            state.postRes = null;
        },
        postFailure: (state, action) => {
            state.loading = false;
            state.postRes = action.payload;
        },
        deleteRequest: (state) => {
            state.loading = true;
        },
        deleteSuccess: (state, action) => {
            state.loading = false;
            state.deleteRes = action.payload;
        },
        deleteFailure: (state, action) => {
            state.loading = false;
            state.deleteRes = action.payload;
        },
        resetDelete: (state) => {
            state.deleteRes = null;
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
        },
        setShowRadiologyForm: (state, action) => {
            state.showRadiologyForm = action.payload;
        },
        setRadiologyAppoinmentId: (state, action) => {
            state.radiologyAppoinmentId = action.payload;
        },

        getRadiologyAppointmentData: (state) => {
            state.loading = true;
        },
        
    }
});

export const { getRequest, getSuccess, getFailure, resetGet, postRequest, postSuccess, postFailure, resetPost, deleteRequest, deleteSuccess, deleteFailure, resetDelete, putRequest, putSuccess, putFailure, resetPut,
    getIdRequest,
    getIdSuccess,
    getIdFailure,
    resetIdGet,
    getPatientRequest,
    getPatientSuccess,
    getPatientFailure,
    resetGetPatient,
    showRadiologyForm,
    setRadiologyAppoinmentId,
    setShowRadiologyForm,
    getRadiologyAppointmentData,
   
} = slice.actions;

export default slice.reducer;