import {useDispatch, useSelector} from "react-redux";
import {useWebSocket} from "../../WebSocketProvider";
import {changeState} from "../../redux/game/gameStateSlice";
import SceneComponent from "./SceneComponent";
import GameController from "../gameController/GameController";
import {logout} from "../../redux/auth/authSlice";
import {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {toggleGaming} from "../../redux/app/appSlice";


const StartTown= () => {
    const dispatch= useDispatch();
    const navigate= useNavigate()
    const {ws} = useWebSocket();
    const{value} = useSelector((state)=> state.game)
    const{user}=useSelector(state=>state.auth)

    useEffect(()=>{
        if(!user){
            navigate('/')
            dispatch(toggleGaming(false))
        }
    },[user])

    const onSceneReady = async (scene,engine) => {

        let game = new GameController(scene, ws, engine, value, dispatch, changeState(),logout());
    };

    return (
        <>
            <SceneComponent antialias onSceneReady={onSceneReady} id="my-canvas"/>
        </>
    )

};

export default StartTown;
