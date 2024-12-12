import { createSlice } from '@reduxjs/toolkit';

let initialState = {
    loading: false,
    reffingSignRes: null,
    appointerSignRes: null,
};

const slice = createSlice({
    name: 'signature',
    initialState,
    reducers: {
        postAppointerSign: (state) => {
            state.loading = true;
        },
        appointerSignSuccess: (state, action) => {
            state.loading = false;
            state.appointerSignRes = action.payload;
        },
        appointerSignFail: (state, action) => {
            state.loading = false;
            state.appointerSignRes = action.payload;
        },
        resetAppointerSign: (state) => {
            state.appointerSignRes = null;
        }
    }
});

export const { postAppointerSign, appointerSignSuccess, appointerSignFail, resetAppointerSign } = slice.actions;

export default slice.reducer;