import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import profileService from "./profileService";
import {authSlice} from "../auth/authSlice";

let profile

const initialState={
    profile: profile ? profile:null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message:'',
}

export const createProfile = createAsyncThunk('profile/create', async({profile}, thunkApi)=>{
    try {
        const token = thunkApi.getState().auth.user.token
        return await profileService.createProfile(profile, token)
    } catch (error) {
        const message = error.response.data.errors[0].msg
        return thunkApi.rejectWithValue(message)
    }
})

export const getProfile= createAsyncThunk('profile/get', async ({},thunkApi)=>{
    try {
        const token = thunkApi.getState().auth.user.token
        return await profileService.getProfile(token)
    } catch (error) {
        const message = error.response.data.errors[0].msg
        return thunkApi.rejectWithValue(message)
    }
})

export const profileSlice= createSlice({
    name: 'profile',
    initialState,
    reducers:{
        resetProfile:(state)=>{
            state.isLoading = false;
            state.isError = false;
            state.isSuccess= false;
            state.message = "";
        },
    },
    extraReducers:(builder)=> {
        builder
            .addCase(createProfile.pending, (state) => {
                state.isLoading = true
            })
            .addCase(createProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.profile = action.payload
            })
            .addCase(createProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.profile = null;
            })
            .addCase(getProfile.pending, (state) => {
                state.isLoading = true
                state.isSuccess = false;
            })
            .addCase(getProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.profile = action.payload
            })
            .addCase(getProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.profile = null;
            })
    }
})

export const{ resetProfile} = profileSlice.actions
export default profileSlice.reducer
