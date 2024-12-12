import { createSlice } from '@reduxjs/toolkit';

let initialState = {
    loading: false,
    getRes: null,
    // getPatientAppointmentRes: null,
    getParentPatientRes: null,
    getInstancesRes: null,
    postReportRes: null,
    putReportRes: null,
    getReportRes: null,
    getStudiesRes: null,
    getStudiesImagesRes: null,
    getSeniorRadiologistRes: null,
    generateReportPDFRes: null,
};

const slice = createSlice({
    name: 'report',
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
        // getPatientAppointmentRequest: (state) => {
        //     state.loading = true;
        // },
        // getPatientAppointmentSuccess: (state, action) => {
        //     state.loading = false;
        //     state.getPatientAppointmentRes = action.payload;
        // },
        // getPatientAppointmentFailure: (state, action) => {
        //     state.loading = false;
        //     state.getPatientAppointmentRes = action.payload;
        // },
        // resetGetPatientAppointment: (state) => {
        //     state.getPatientAppointmentRes = null;
        // },

        getParentPatientRequest: (state) => {
            state.loading = true;
        },
        getParentPatientSuccess: (state, action) => {
            state.loading = false;
            state.getParentPatientRes = action.payload;
        },
        getParentPatientFailure: (state, action) => {
            state.loading = false;
            state.getParentPatientRes = action.payload;
        },
        resetGetParentPatient: (state) => {
            state.getParentPatientRes = null;
        },

        getInstancesRequest: (state) => {
            state.loading = true;
        },
        getInstancesSuccess: (state, action) => {
            state.loading = false;
            state.getInstancesRes = action.payload;
        },
        getInstancesFailure: (state, action) => {
            state.loading = false;
            state.getInstancesRes = action.payload;
        },
        resetGetInstances: (state) => {
            state.getInstancesRes = null;
        },

        postReportRequest: (state) => {
            state.loading = true;
        },
        postReportSuccess: (state, action) => {
            state.loading = false;
            state.postReportRes = action.payload;
        },
        postReportFailure: (state, action) => {
            state.loading = false;
            state.postReportRes = action.payload;
        },
        resetPostReport: (state) => {
            state.postReportRes = null;
        },

        putReportRequest: (state) => {
            state.loading = true;
        },
        putReportSuccess: (state, action) => {
            state.loading = false;
            state.putReportRes = action.payload;
        },
        putReportFailure: (state, action) => {
            state.loading = false;
            state.putReportRes = action.payload;
        },
        resetPutReport: (state) => {
            state.putReportRes = null;
        },

        getStudiesRequest: (state) => {
            state.loading = true;
        },
        getStudiesSuccess: (state, action) => {
            state.loading = false;
            state.getStudiesRes = action.payload;
        },
        getStudiesFailure: (state, action) => {
            state.loading = false;
            state.getStudiesRes = action.payload;
        },
        resetGetStudies: (state) => {
            state.getStudiesRes = null;
        },

        getStudiesImagesRequest: (state) => {
            state.loading = true;
        },
        getStudiesImagesSuccess: (state, action) => {
            state.loading = false;
            state.getStudiesImagesRes = action.payload;
        },
        getStudiesImagesFailure: (state, action) => {
            state.loading = false;
            state.getStudiesImagesRes = action.payload;
        },
        resetGetStudiesImages: (state) => {
            state.getStudiesImagesRes = null;
        },

        getReportRequest: (state) => {
            state.loading = true;
        },
        getReportSuccess: (state, action) => {
            state.loading = false;
            state.getReportRes = action.payload;
        },
        getReportFailure: (state, action) => {
            state.loading = false;
            state.getReportRes = action.payload;
        },
        resetGetReport: (state) => {
            state.getReportRes = null;
        },
        getSeniorRadiologistRequest: (state) => {
            state.loading = true;
        },
        getSeniorRadiologistSuccess: (state, action) => {
            state.loading = false;
            state.getSeniorRadiologistRes = action.payload;
        },
        getSeniorRadiologistFailure: (state, action) => {
            state.loading = false;
            state.getSeniorRadiologistRes = action.payload;
        },
        resetGetSeniorRadiologist: (state) => {
            state.getSeniorRadiologistRes = null;
        },
        getGenerateReportPDFRequest: (state) => {
            state.loading = true;
        },
        getGenerateReportPDFSuccess: (state, action) => {
            state.loading = false;
            state.generateReportPDFRes = action.payload;
        },
        getGenerateReportPDFFailure: (state, action) => {
            state.loading = false;
            state.generateReportPDFRes = action.payload;
        },
        resetGenerateReportPDF: (state) => {
            state.generateReportPDFRes = null;
        },
    }
});


export const { getRequest, getSuccess, getFailure, resetGet,
    // getPatientAppointmentRequest,
    // getPatientAppointmentSuccess,
    // getPatientAppointmentFailure,
    // resetGetPatientAppointment,

    getParentPatientRequest,
    getParentPatientSuccess,
    getParentPatientFailure,
    resetGetParentPatient,


    getInstancesRequest,
    getInstancesSuccess,
    getInstancesFailure,
    resetGetInstances,

    postReportRequest,
    postReportSuccess,
    postReportFailure,
    resetPostReport,

    putReportRequest,
    putReportSuccess,
    putReportFailure,
    resetPutReport,

    getStudiesRequest,
    getStudiesSuccess,
    getStudiesFailure,
    resetGetStudies,

    getStudiesImagesRequest,
    getStudiesImagesSuccess,
    getStudiesImagesFailure,
    resetGetStudiesImages,

    getReportRequest,
    getReportSuccess,
    getReportFailure,
    resetGetReport,

    getSeniorRadiologistRequest,
    getSeniorRadiologistSuccess,
    getSeniorRadiologistFailure,
    resetGetSeniorRadiologist,

    getGenerateReportPDFRequest,
    getGenerateReportPDFSuccess,
    getGenerateReportPDFFailure,
    resetGenerateReportPDF,

} = slice.actions;

export default slice.reducer;