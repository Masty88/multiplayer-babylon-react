import React, {useEffect} from "react";
import SceneComponent from "./SceneComponent";
import {useDispatch, useSelector} from "react-redux";
import {changeState} from "../redux/gameState";
import GameController from "../game controller/GameController";
import {useWebSocket, WebSocketProvider} from "../webSocketContext"; // uses above component in same directory



const GameScene= () => {
    const dispatch= useDispatch();
    const {isConnected, ws, err} = useWebSocket();
    const onSceneReady = async (scene,engine) => {
            engine.displayLoadingUI();
            let game = new GameController(scene, ws);
            await scene.whenReadyAsync();
            engine.hideLoadingUI();
            if(game.gameOver){
                console.log("gameover")
                dispatch(changeState());
            }

    };

    return (
        <>
            <SceneComponent antialias onSceneReady={onSceneReady} id="my-canvas"/>
        </>

    )

};

export default GameScene;
