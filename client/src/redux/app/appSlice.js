import { createSlice } from "@reduxjs/toolkit";

const appSlice = createSlice({
    name: 'app',
    initialState:{
        loading: true,
    },
    reducers:{
        toggleLoading:(state,action) =>{
            state.loading = !state.loading
            console.log(state.loading)
        },
    }
});

export const {toggleLoading} = appSlice.actions;
export default appSlice.reducer;
