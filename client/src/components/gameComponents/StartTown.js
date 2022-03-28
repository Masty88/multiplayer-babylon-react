import {useDispatch, useSelector} from "react-redux";
import {useWebSocket} from "../../WebSocketProvider";
import {changeState} from "../../redux/game/gameStateSlice";
import SceneComponent from "./SceneComponent";
import GameController from "../gameController/GameController";
import {logout, reset} from "../../redux/auth/authSlice";
import {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {toggleGaming} from "../../redux/app/appSlice";
import {createProfile, resetProfile} from "../../redux/profile/profileSlice";
import Loading from "../layout/Loading";


const StartTown= () => {
    const dispatch= useDispatch();
    const tutorial=false;
    const navigate= useNavigate()
    const {ws, isConnected} = useWebSocket();
    const{value} = useSelector((state)=> state.game)
    const{user}=useSelector(state=>state.auth)
    const{ profile}= useSelector((state)=>
        state.profile)

    useEffect(()=>{
        if(!user){
            navigate('/')
            dispatch(toggleGaming(false))
        }
    },[user])

    console.log(isConnected)

    const onSceneReady = async (scene,engine) => {

        let game = new GameController(scene,
            ws,
            engine,
            value,
            dispatch,
            changeState(),
            logout({}),
            resetProfile(),
            profile,
            user.user._id,
            createProfile({profile:tutorial})
            )

    };

    return (
        <>
            {isConnected?(
                <SceneComponent antialias onSceneReady={onSceneReady} id="my-canvas"/>
            ):(<Loading loading={isConnected}/> )}
        </>
    )

};

export default StartTown;
