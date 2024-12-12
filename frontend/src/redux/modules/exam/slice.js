import { createSlice } from '@reduxjs/toolkit';

let initialState = {
    loading: false,
    postGroupRes: null,
    getGroupRes: null,
    getGroupIdRes: null,
    putGroupRes: null,
    deleteGroupRes: null,
    postListRes: null,
    putListRes: null,
    getListRes: null,
    deleteListRes: null,
};

const slice = createSlice({
    name: 'exam',
    initialState,
    reducers: {
        postExamGroupRequest: (state) => {
            state.loading = true;
        },
        postExamGroupSuccess: (state, action) => {
            state.loading = false;
            state.postGroupRes = action.payload;
        },
        postExamGroupFailure: (state, action) => {
            state.loading = false;
            state.postGroupRes = action.payload;
        },
        resetPostExamGroup: (state) => {
            state.postGroupRes = null;
        },

        getExamGroupRequest: (state) => {
            state.loading = true;
        },
        getExamGroupSuccess: (state, action) => {
            state.loading = false;
            state.getGroupRes = action.payload;
        },
        getExamGroupFailure: (state, action) => {
            state.loading = false;
            state.getGroupRes = action.payload;
        },
        resetGetExamGroup: (state) => {
            state.getGroupRes = null;
        },
        
        getExamGroupIdRequest: (state) => {
            state.loading = true;
        },
        getExamGroupIdSuccess: (state, action) => {
            state.loading = false;
            state.getGroupIdRes = action.payload;
        },
        getExamGroupIdFailure: (state, action) => {
            state.loading = false;
            state.getGroupIdRes = action.payload;
        },
        
        resetGetExamGroupId: (state) => {
            state.getGroupIdRes = null;
        },


        putExamGroupRequest: (state) => {
            state.loading = true;
        },
        putExamGroupSuccess: (state, action) => {
            state.loading = false;
            state.putGroupRes = action.payload;
        },
        putExamGroupFailure: (state, action) => {
            state.loading = false;
            state.putGroupRes = action.payload;
        },
        resetPutExamGroup: (state) => {
            state.putGroupRes = null;
        },
        deleteExamGroupRequest: (state) => {
            state.loading = true;
        },
        deleteExamGroupSuccess: (state, action) => {
            state.loading = false;
            state.deleteGroupRes = action.payload;
        },
        deleteExamGroupFailure: (state, action) => {
            state.loading = false;
            state.deleteGroupRes = action.payload;
        },
        resetDeleteExamGroup: (state) => {
            state.deleteGroupRes = null;
        },
        
        postExamListRequest: (state) => {
            state.loading = true;
        },
        postExamListSuccess: (state, action) => {
            state.loading = false;
            state.postListRes = action.payload;
        },
        postExamListFailure: (state, action) => {
            state.loading = false;
            state.postListRes = action.payload;
        },
        resetPostExamList: (state) => {
            state.postListRes = null;
        },

        putExamListRequest: (state) => {
            state.loading = true;
        },
        putExamListSuccess: (state, action) => {
            state.loading = false;
            state.putListRes = action.payload;
        },
        putExamListFailure: (state, action) => {
            state.loading = false;
            state.putListRes = action.payload;
        },
        resetPutExamList: (state) => {
            state.putListRes = null;
        },

        getExamListRequest: (state) => {
            state.loading = true;
        },
        getExamListSuccess: (state, action) => {
            state.loading = false;
            state.getListRes = action.payload;
        },
        getExamListFailure: (state, action) => {
            state.loading = false;
            state.getListRes = action.payload;
        },
        resetGetExamList: (state) => {
            state.getListRes = null;
        },

        deleteExamListRequest: (state) => {
            state.loading = true;
        },
        deleteExamListSuccess: (state, action) => {
            state.loading = false;
            state.deleteListRes = action.payload;
        },
        deleteExamListFailure: (state, action) => {
            state.loading = false;
            state.deleteListRes = action.payload;
        },
        resetDeleteExamList: (state) => {
            state.deleteListRes = null;
        },

    }
});


export const {
    postExamGroupRequest,
    postExamGroupSuccess,
    postExamGroupFailure,
    resetPostExamGroup,

    getExamGroupRequest,
    getExamGroupSuccess,
    getExamGroupFailure,
    resetGetExamGroup,

    getExamGroupIdRequest,
    getExamGroupIdSuccess,
    getExamGroupIdFailure,
    resetGetExamGroupId,

    putExamGroupRequest,
    putExamGroupSuccess,
    putExamGroupFailure,
    resetPutExamGroup,

    deleteExamGroupRequest,
    deleteExamGroupSuccess,
    deleteExamGroupFailure,
    resetDeleteExamGroup,


    postExamListRequest,
    postExamListSuccess,
    postExamListFailure,
    resetPostExamList,

    putExamListRequest,
    putExamListSuccess,
    putExamListFailure,
    resetPutExamList,

    getExamListRequest,
    getExamListSuccess,
    getExamListFailure,
    resetGetExamList,

    deleteExamListRequest,
    deleteExamListSuccess,
    deleteExamListFailure,
    resetDeleteExamList
} = slice.actions;

export default slice.reducer;