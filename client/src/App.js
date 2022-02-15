import './App.css';
import {useDispatch, useSelector} from "react-redux";
import {changeState} from "./redux/gameState";
import GoToStart from "./components/StartScene";
import StartScene from "./components/StartScene";
import CutScene from "./components/CutScene";
import GameScene from "./components/GameScene";
import GameOverScene from "./components/GameOverScene";
import {useEffect} from "react";
import {useWebSocket, WebSocketProvider} from "./webSocketContext";



function App() {
  const{value} = useSelector((state)=> state.gameState)
    let scene;
   const {isConnected, ws, err} = useWebSocket();

  switch (value){
    case 0:
      scene=<StartScene/>
          break;
    case 1:
      scene=<CutScene/>
          break;
    case 2:
      scene=<GameScene/>
          break;
    case 3:
      scene=<GameOverScene/>
    default:break;

  }

  return (
        <div className="App">
          {scene}
        </div>
  );
}

const AppContainer=()=>{
    return(
        <WebSocketProvider url="ws://localhost:4000">
            <App/>
        </WebSocketProvider>
        )

}

export default AppContainer;
