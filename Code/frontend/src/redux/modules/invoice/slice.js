import { createSlice } from '@reduxjs/toolkit';

let initialState = {
    loading: false,
    getInvoiceRes: null,
    postInvoice: null,
    putInvoice: null
};

const slice = createSlice({
    name: 'invoice',
    initialState,
    reducers: {
        getRequest: (state) => {
            state.loading = true;
        },
        getSuccess: (state, action) => {
            state.loading = false;
            state.getInvoiceRes = action.payload;
        },
        getFailure: (state, action) => {
            state.loading = false;
            state.getInvoiceRes = action.payload;
        },
        resetGet: (state) => {
            state.getInvoiceRes = null;
        },
        postRequest: (state) => {
            state.loading = true;
        },
        postSuccess: (state, action) => {
            state.loading = false;
            state.postInvoice = action.payload;
        },
        postFailure: (state, action) => {
            state.loading = false;
            state.postInvoice = action.payload;
        },
        resetPost: (state) => {
            state.postInvoice = null;
        },
        putRequest: (state) => {
            state.loading = true;
        },
        putSuccess: (state, action) => {
            state.loading = false;
            state.putInvoice = action.payload;
        },
        putFailure: (state, action) => {
            state.loading = false;
            state.putInvoice = action.payload;
        },
        resetPut: (state) => {
            state.putInvoice = null;
        },
    }
});


export const { getRequest, getSuccess, getFailure, resetGet, postRequest, postFailure, postSuccess, resetPost, putRequest, putFailure, putSuccess, resetPut } = slice.actions;

export default slice.reducer;