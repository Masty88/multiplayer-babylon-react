import React, {useEffect} from "react";
import SceneComponent from "./SceneComponent";
import {useDispatch, useSelector} from "react-redux";
import {changeState} from "../redux/gameState";
import GameController from "../game controller/GameController";
import {useWebSocket, WebSocketProvider} from "../webSocketContext"; // uses above component in same directory



const GameScene= () => {
    const dispatch= useDispatch();
    const {isConnected, ws, err} = useWebSocket();
    const{value} = useSelector((state)=> state.gameState)
    const onSceneReady = async (scene,engine) => {
        let game = new GameController(scene, ws, engine, value, dispatch, changeState());
    };

    const onRender = (scene) => {
        console.log(value)
        // let game = new GameController();
        // console.log(game.changeScene) y f nnnnnnrrnn
    };

    return (
        <>
            <SceneComponent antialias onSceneReady={onSceneReady} onRender={onRender} id="my-canvas"/>
        </>

    )

};

export default GameScene;
