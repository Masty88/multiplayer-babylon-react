import React, {useEffect} from 'react';
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {toggleLoading} from "../../redux/app/appSlice";
import StartTown from "../gameComponents/StartTown";
import StartScene from "../gameComponents/StartScene";
import Desert from "../gameComponents/Desert";
import {WebSocketProvider} from "../../WebSocketProvider";

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
        case "DESERT":
            city=<Desert/>
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
            <WebSocketProvider
                url={process.env.REACT_APP_API_URL}>
            {city}
            </WebSocketProvider>
        </>
    );
};

export default Game;
