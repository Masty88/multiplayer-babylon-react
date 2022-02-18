import {useDispatch, useSelector} from "react-redux";
import {useWebSocket} from "../webSocketContext";
import {changeState} from "../redux/gameState";
import SceneComponent from "./SceneComponent";

import GameController from "../game controller/GameController";




const GameScene= () => {
    const dispatch= useDispatch();
    const { ws} = useWebSocket();
    const{value} = useSelector((state)=> state.gameState)

    const onSceneReady = async (scene,engine) => {
        let game = new GameController(scene, ws, engine, value, dispatch, changeState());
    };

    return (
        <>
            <SceneComponent antialias onSceneReady={onSceneReady} id="my-canvas"/>
        </>
    )

};

export default GameScene;
