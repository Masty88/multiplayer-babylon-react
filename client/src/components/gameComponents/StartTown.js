import {useDispatch, useSelector} from "react-redux";
import {useWebSocket} from "../../WebSocketProvider";
import {changeState} from "../../redux/game/gameStateSlice";
import SceneComponent from "./SceneComponent";
import {Camera} from "@mui/icons-material";

const StartTown= () => {
    const dispatch= useDispatch();
    const { ws} = useWebSocket();
    const{value} = useSelector((state)=> state.game)

    const onSceneReady = async (scene,engine) => {

        // let game = new GameController(scene, ws, engine, value, dispatch, changeState());
    };

    return (
        <>
            <SceneComponent antialias onSceneReady={onSceneReady} id="my-canvas"/>
        </>
    )

};

export default StartTown;
