import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice'
import profileReducer from  './profile/profileSlice'
import appReducer from './app/appSlice'

export const store= configureStore({
    reducer:{
        auth: authReducer,
        profile: profileReducer,
        app: appReducer,
    }
})
