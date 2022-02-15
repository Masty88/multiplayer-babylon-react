import GameObject from "./GameObject";
import {ActionManager, ExecuteCodeAction, Scalar} from "@babylonjs/core";


class InputController extends GameObject{
    constructor(socket, player) {
        super();
        this.scene.actionManager= new ActionManager(this.scene);
        this.inputMap={};

        this.scene.actionManager.registerAction(
            new ExecuteCodeAction(ActionManager.OnKeyDownTrigger,(event)=>{
                this.inputMap[event.sourceEvent.key]= event.sourceEvent.type == "keydown";
            }));
        this.scene.actionManager.registerAction(
            new ExecuteCodeAction(ActionManager.OnKeyUpTrigger,(event)=>{
                this.inputMap[event.sourceEvent.key]=event.sourceEvent.type == "keydown";
            }));

        this.scene.onBeforeRenderObservable.add(()=>{
            this.updateFromKeyboard();
        })

        this.socket= socket;
        this.player= player
    }

    updateFromKeyboard=()=>{
        if (this.inputMap["ArrowUp"]) {
            this.vertical = Scalar.Lerp(this.vertical, 1, 0.2);
            this.verticalAxis = 1;
            this.notifyServer= true;

        } else if (this.inputMap["ArrowDown"]) {
            this.vertical = Scalar.Lerp(this.vertical, -1, 0.2);
            this.verticalAxis = -1;
            this.notifyServer= true;
        } else {
            this.vertical = 0;
            this.verticalAxis = 0;
            this.notifyServer= false;
        }

        if (this.inputMap["ArrowLeft"]) {
            this.horizontal = Scalar.Lerp(this.horizontal, -1, 0.2);
            this.horizontalAxis = -1;
            this.notifyServer= true;

        } else if (this.inputMap["ArrowRight"]) {
            this.horizontal = Scalar.Lerp(this.horizontal, 1, 0.2);
            this.horizontalAxis = 1;
            this.notifyServer= true;
        }
        else {
            this.horizontal = 0;
            this.horizontalAxis = 0;
            this.notifyServer= false;
        }
        if(this.notifyServer){
            this.player.state.x= this.player.mesh.position.x;
            this.player.state.y= this.player.mesh.position.y;
            this.player.state.z= this.player.mesh.position.z;
            this.player.state.rX= this.player.mesh.rotation.x;
            this.player.state.rY =this.player.mesh.rotation.y;
            this.player.state.rZ= this.player.mesh.rotation.z;
            this.socket.emit("playerMove", this.player.state)
            console.log(this.player.state)
        }

    }
}

export default InputController;
