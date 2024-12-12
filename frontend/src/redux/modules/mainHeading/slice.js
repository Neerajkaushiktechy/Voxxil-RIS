import { createSlice } from '@reduxjs/toolkit';

let initialState = {
    mainHeading: "Welcome back!",
};

const slice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        setMainHeading : (state,action) => {
            state.mainHeading = action.payload;
        },
    }
});


export const {setMainHeading} = slice.actions;

export default slice.reducer;