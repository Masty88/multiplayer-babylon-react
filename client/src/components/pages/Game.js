import React, {useEffect} from 'react';
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {toggleLoading} from "../../redux/app/appSlice";
import StartTown from "../gameComponents/StartTown";

let city

const Game = () => {
    const navigate= useNavigate();
    const dispatch= useDispatch();

    const{ user }= useSelector((state)=>
        state.auth)

    const {value}= useSelector((state)=>
        state.game
    )

    switch (value){
        case "START_CITY":
            city=<StartTown/>
            break;
        default: break;
    }

    useEffect(()=>{
        if(!user){
            navigate('/')
        }
    },[user])

    return (
        <>
            {city}
        </>
    );
};

export default Game;
