import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import CreateProfile from "../layout/CreateProfile";
import {getProfile} from "../../redux/profile/profileSlice";
import {useNavigate} from "react-router-dom";
import Loading from "../layout/Loading";
import Game from "./Game";
import {toggleLoading} from "../../redux/app/appSlice";

const MainMenu = () => {
    const dispatch= useDispatch()
    const navigate = useNavigate();
    const{ profile,isLoading}= useSelector((state)=>
        state.profile)
    const {user}=useSelector((state)=>
        state.auth)

    useEffect(()=>{
      dispatch(getProfile({}))
        if(!user)navigate('/')
    },[user])

    if(isLoading) return <Loading active={isLoading}/>

    return (
        <>
            {profile? (<Game/>): (<CreateProfile/>)}
        </>
    );
};

export default MainMenu;
