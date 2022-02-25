import { createSlice } from "@reduxjs/toolkit";

const appSlice = createSlice({
    name: 'app',
    initialState:{
        loading: true,
    },
    reducers:{
        toggleLoading:(state, action) =>{
            state.loading = action.payload
        },
    }
});

export const {toggleLoading, setUser} = appSlice.actions;
export default appSlice.reducer;
