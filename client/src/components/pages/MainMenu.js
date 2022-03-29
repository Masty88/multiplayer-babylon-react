import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import CreateProfile from "../layout/CreateProfile";
import {getProfile} from "../../redux/profile/profileSlice";
import {useNavigate} from "react-router-dom";
import Loading from "../layout/Loading";
import Game from "./Game";
import {toggleGaming, toggleLoading} from "../../redux/app/appSlice";

const MainMenu = () => {
    const dispatch= useDispatch()
    const navigate = useNavigate();
    const{ profile,isLoading, isSuccess}= useSelector((state)=>
        state.profile)
    const {user}=useSelector((state)=>
        state.auth)
    const {loading}= useSelector((state)=>
    state.app)

    useEffect(()=>{
      dispatch(getProfile({}))
        if(!user)navigate('/')
        if(isSuccess){
         dispatch(toggleGaming(true));
         navigate('/game')
        }
    },[profile])

    console.log(isLoading)

    return (
        <>
            {isLoading?(
                <Loading loading={isLoading}/>
            ):(
                <CreateProfile/>
            )}
        </>
    );
};

export default MainMenu;
