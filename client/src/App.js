import './App.css';
import {useDispatch, useSelector} from "react-redux";
import {changeState} from "./redux/gameState";
import GoToStart from "./components/StartScene";
import StartScene from "./components/StartScene";
import CutScene from "./components/CutScene";
import GameScene from "./components/GameScene";
import GameOverScene from "./components/GameOverScene";



function App() {
  const{value} = useSelector((state)=> state.gameState)
    const dispatch = useDispatch()
    let scene;


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

export default App;
