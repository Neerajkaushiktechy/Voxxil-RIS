import { createSlice } from '@reduxjs/toolkit';

let initialState = {
    loading: false,
    postRes : null,
};

const slice = createSlice({
    name: 'enquiry',
    initialState,
    reducers: {
        postRequest: (state) => {
            state.loading = true;
        },
        postSuccess: (state, action) => {
            state.loading = false;
            state.postRes = action.payload;
        },
        postFailure: (state, action) => {
            state.loading = false;
            state.postRes = action.payload;
        },
        resetPost: (state) => {
            state.postRes = null;
        },
    }
});

export const { postRequest, postSuccess, postFailure, resetPost } = slice.actions;

export default slice.reducer;