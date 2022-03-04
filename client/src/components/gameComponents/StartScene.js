import React from "react";
import SceneComponent from "./SceneComponent";
import {useDispatch, useSelector} from "react-redux";
import {changeState} from "../../redux/game/gameStateSlice"
import GameController from "../gameController/GameController"; // uses above component in same directory


const StartScene= () => {
    const dispatch= useDispatch();
    const{value} = useSelector((state)=> state.game)
    const onSceneReady =async  (scene,engine) => {
        let game = new GameController(scene, null, engine, value, dispatch, changeState());
    };

    return (
        <div>
            <SceneComponent antialias onSceneReady={onSceneReady} id="my-canvas"/>
        </div>
    )

};

export default StartScene;
