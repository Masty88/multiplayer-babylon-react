import React from "react";
import SceneComponent from "./SceneComponent";
import {useDispatch, useSelector} from "react-redux";
import {changeState} from "../redux/gameState";
import GameController from "../game controller/GameController"; // uses above component in same directory



const GameScene= () => {
    const dispatch= useDispatch();

    const onSceneReady = async (scene,engine) => {

            engine.displayLoadingUI();
            let game = new GameController(scene);
            await scene.whenReadyAsync();
            engine.hideLoadingUI();
            if(game.gameOver){
                console.log("gameover")
                dispatch(changeState());
            }

    };

    return (
        <div>
            <SceneComponent antialias onSceneReady={onSceneReady} id="my-canvas"/>
        </div>
    )

};

export default GameScene;
