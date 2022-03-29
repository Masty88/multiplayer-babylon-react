import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import authService from "./authService";
import profileService from "../profile/profileService";

//Get user from localStorage
const user= JSON.parse(localStorage.getItem('user'))

const initialState={
    user: user ? user:null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message:'',
}

//Register User
export const register = createAsyncThunk('auth/register',async({user}, thunkApi)=>{
    try{
        return await authService.register(user)
    }catch(error){
    const message = error.response.data.errors[0].msg
    return thunkApi.rejectWithValue(message)
    }
})

//Login User
export const login = createAsyncThunk('auth/login',async({user}, thunkApi)=>{
    try{
        return await authService.login(user)
    }catch(error){
        const message = error.response.data.errors[0].msg
        return thunkApi.rejectWithValue(message)
    }
})

//Authenticate user
export const authenticate = createAsyncThunk('auth/authenticate',async ({}, thunkApi)=>{
    try{
        const token = thunkApi.getState().auth.user.token
        return await authService.authenticate(token)
    }catch(error){
        const message = error.response.data.errors[0].msg
        return thunkApi.rejectWithValue(message)
    }
})

export const logout = createAsyncThunk('auth/logout', async({},thunkApi)=>{
    try{
        const token = thunkApi.getState().auth.user.token
        return await authService.logout(token)
    }catch(error){
        const message = error.response.data.errors[0].msg
        return thunkApi.rejectWithValue(message)
    }
} )

export const authSlice=createSlice({
    name:'auth',
    initialState,
    reducers:{
        reset:(state)=>{
            state.isError = false;
            state.isSuccess = false;
            state.isLoading = false;
            state.message = '';
        }
    },
    extraReducers:(builder)=>{
        builder
            .addCase(register.pending, (state)=>{
                state.isLoading= true
            })
            .addCase(register.fulfilled,(state,action)=>{
                state.isLoading= false;
                state.isSuccess=true;
                state.user = action.payload;
             })
            .addCase(register.rejected,(state,action)=>{
                state.isLoading= false;
                state.isError=true;
                state.message=action.payload;
                state.user = null;
            })
            .addCase(logout.fulfilled,(state)=>{
                state.user= null;
            })
            .addCase(login.pending, (state)=>{
                state.isLoading= true
            })
            .addCase(login.fulfilled,(state,action)=>{
                state.isLoading= false;
                state.isSuccess=true;
                state.user = action.payload
            })
            .addCase(login.rejected,(state,action)=>{
                state.isLoading= false;
                state.isError=true;
                state.message=action.payload;
                state.user = null;
            })
            .addCase(authenticate.pending, (state)=>{
                state.isLoading= true
            })
            .addCase(authenticate.fulfilled,(state,action)=>{
                state.isLoading= false;
                state.isSuccess=true;
                state.user = action.payload;
            })
            .addCase(authenticate.rejected,(state,action)=>{
                state.isLoading= false;
                state.isError=true;
                state.message=action.payload;
                state.user = null;
            })
    }
})

export const{ reset} = authSlice.actions
export default authSlice.reducer
