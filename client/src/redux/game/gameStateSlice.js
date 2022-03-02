import {createSlice} from "@reduxjs/toolkit";

const gameStateSlice= createSlice({
    name: 'game',
    initialState:{
       value: "START_CITY"
    },
    reducers:{
        changeState:(state,action)=>{
            state.value= action.payload
        }
    }
})

export const { changeState } = gameStateSlice.actions;

export default gameStateSlice.reducer;
