import { createSlice } from "@reduxjs/toolkit";

const appSlice = createSlice({
    name: 'app',
    initialState:{
        loading: true,
        gaming: false
    },
    reducers:{
        toggleLoading:(state,action) =>{
            state.loading = !state.loading
        },
        toggleGaming:(state,action)=>{
            state.gaming=action.payload
        }
    }
});

export const {toggleLoading,toggleGaming} = appSlice.actions;
export default appSlice.reducer;
