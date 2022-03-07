import React, {useEffect} from 'react';
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {toggleLoading} from "../../redux/app/appSlice";
import StartTown from "../gameComponents/StartTown";
import StartScene from "../gameComponents/StartScene";

let city

const Game = () => {
    const navigate= useNavigate();
    const dispatch= useDispatch();

    const{ user }= useSelector((state)=>
        state.auth)

    const {value}= useSelector((state)=>
        state.game
    )
    const{gaming}= useSelector((state)=>state.app)

    switch (value){
        case "GO_TO_START":
            city=<StartScene/>
            break;
        case "START_CITY":
            city=<StartTown/>
            break;
        default: break;
    }

    useEffect(()=>{
        if(!user){
            navigate('/')
        }
        if(!gaming){
            navigate('/')
        }
    },[])

    return (
        <>
            {city}
        </>
    );
};

export default Game;
