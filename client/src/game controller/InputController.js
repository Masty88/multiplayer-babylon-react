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

        // //jumping and dashing
        // this.jumpKeyDown = false;
        // this.dashing = false;

        this.player= player;
        console.log(this.player)
    }

    updateFromKeyboard=()=>{
        if (this.inputMap["ArrowLeft"]) {
            this.horizontal = Scalar.Lerp(this.horizontal, -1, 0.2);
            this.horizontalAxis = -1;

        } else if (this.inputMap["ArrowRight"]) {
            this.horizontal = Scalar.Lerp(this.horizontal, 1, 0.2);
            this.horizontalAxis = 1;
        }
        else {
            this.horizontal = 0;
            this.horizontalAxis = 0;
        }

        if (this.inputMap["ArrowUp"]) {
            this.vertical = Scalar.Lerp(this.vertical, 1, 0.2);
            this.verticalAxis = 1;

        } else if (this.inputMap["ArrowDown"]) {
            this.vertical = Scalar.Lerp(this.vertical, -1, 0.2);
            this.verticalAxis = -1;
        } else {
            this.vertical = 0;
            this.verticalAxis = 0;
        }

        //dash
        if (this.inputMap["Shift"]) {
            this.dashing = true;
        } else {
            this.dashing = false;
        }

        //Jump Checks (SPACE)
        if (this.inputMap[" "]) {
            this.jumpKeyDown = true;
        } else {
            this.jumpKeyDown = false;
        }

        if(this.inputMap["ArrowDown"] || this.inputMap["ArrowUp"] || this.inputMap["ArrowRight"] || this.inputMap["ArrowLeft"]){
            this.notifyServer= true;
        }
        else{
            this.notifyServer= false;
        }

        if(this.notifyServer){
            this.player.state.x= this.player.mesh.position.x;
            this.player.state.y= this.player.mesh.position.y;
            this.player.state.z= this.player.mesh.position.z;
            this.player.state.rW= this.player.mesh.rotationQuaternion.w;
            this.player.state.rY= this.player.mesh.rotationQuaternion.y;
            this.socket.emit("playerMove", this.player.state)
        }

    }
}

export default InputController;
