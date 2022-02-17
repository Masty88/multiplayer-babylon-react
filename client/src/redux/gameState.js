import {createSlice} from "@reduxjs/toolkit";

export const gameStateSlice= createSlice({
    name: "start",
    initialState:{
        value: 0
    },
    reducers:{
        changeState: (state)=>{
            state.value +=1
            console.log("i dispacth")
        }
    }
})

export const { changeState } = gameStateSlice.actions;

export default gameStateSlice.reducer;
