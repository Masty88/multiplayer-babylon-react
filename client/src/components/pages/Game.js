import React, {useEffect} from 'react';
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {toggleLoading} from "../../redux/app/appSlice";


const Game = () => {
    const navigate= useNavigate();
    const dispatch= useDispatch();

    const{ user }= useSelector((state)=>
        state.auth)

    const{profile}= useSelector((state)=>
        state.profile)

    useEffect(()=>{
        if(!user){
            navigate('/')
        }
    },[user])

    return (
        <>
            {user&&
                (<div>
                    You are gaming {user.user.username} with your {profile.mesh}
                </div>)
            }
        </>
    );
};

export default Game;
