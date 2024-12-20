import { createSlice } from '@reduxjs/toolkit';

let initialState = {
    showList: false,
};

const slice = createSlice({
    name: 'showList',
    initialState,
    reducers: {
        setShowList: (state, action) => {
            state.showList = action.payload;
        }

    }
});

export const { setShowList } = slice.actions;

export default slice.reducer;