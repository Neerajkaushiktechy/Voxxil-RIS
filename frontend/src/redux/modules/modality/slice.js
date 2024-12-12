import { createSlice } from '@reduxjs/toolkit';

let initialState = {
    loading: false,
    modalities:[],
    deleteListRes: null,
    postListRes: null,
    putListRes: null,
};

const slice = createSlice({
    name: 'modalities',
    initialState,
    reducers: {
        getModalityListRequest: (state) => {
            state.loading = true;
        },
        getModalitiesSuccess: (state, action) => {
            state.loading = false;
            state.modalities = action.payload;
        },
        getModalitiesFailure: (state, action) => {
            state.loading = false;
            state.modalities =[];
        },
        resetGetModalityGroup: (state) => {
            state.loading = false;
            state.modalities =[];
        },
        resetDeleteModalityList: (state) => {
            state.deleteListRes = null;
        },
        deleteModalityListRequest: (state) => {
            state.loading = true;
        },
        deleteModalityListSuccess: (state, action) => {
            state.loading = false;
            state.deleteListRes = action.payload;
        },
        deleteModalityListFailure: (state, action) => {
            state.loading = false;
            state.deleteListRes = action.payload;
        },
        postModalityListRequest: (state) => {
            state.loading = true;
        },
        postModalityListSuccess: (state, action) => {
            state.loading = false;
            state.postListRes = action.payload;
        },
        postModalityListFailure: (state, action) => {
            state.loading = false;
            state.postListRes = action.payload;
        },
        putModalityListRequest: (state) => {
            state.loading = true;
        },
        putModalityListSuccess: (state, action) => {
            state.loading = false;
            state.putListRes = action.payload;
        },
        putModalityListFailure: (state, action) => {
            state.loading = false;
            state.putListRes = action.payload;
        },
        resetPostModalityList: (state) => {
            state.postListRes = null;
        },
        resetPutModalityList: (state) => {
            state.putListRes = null;
        },
    }
});

export const {
    getModalityListRequest,
    getModalitiesSuccess,
    getModalitiesFailure,
    resetGetModalityGroup,
    deleteModalityListRequest,
    deleteModalityListSuccess,
    deleteModalityListFailure,
    resetDeleteModalityList,
    postModalityListRequest,
    postModalityListSuccess,
    postModalityListFailure,
    putModalityListRequest,
    putModalityListSuccess,
    putModalityListFailure,
    resetPostModalityList,
    resetPutModalityList
}= slice.actions;

export default slice.reducer;
