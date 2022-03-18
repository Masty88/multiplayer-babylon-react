import GameObject from "./GameObject";
import {
    ActionManager,
    ArcRotateCamera,
    ExecuteCodeAction,
    FreeCamera,
    PointerEventTypes,
    Scalar, TransformNode,
    Vector3
} from "@babylonjs/core";



class InputController extends GameObject{


    constructor(socket, player, value, engine) {
        super();
        console.log("activate input")
        this.value= value
        this.player= player;

        this.engine= engine;
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
        this.scene.onAfterRenderObservable.add(()=>{
            this.updateFromKeyboard();
        })

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

        //Jump Checks (SPACE)
        if (this.inputMap[" "]) {
            this.jumpKeyDown = true;
        } else {
            this.jumpKeyDown = false;
        }

        //Jump Checks (SPACE)
        if (this.inputMap["e"]) {
            this.freeCam= new ArcRotateCamera("Camera", Math.PI / 2, 0, 2, Vector3.Zero(), this.scene);
            this.freeCam.inputs.attached.keyboard.detachControl()
            this.freeCam.checkCollisions=true
            this.freeCam.setPosition(new Vector3(0,5,0))
            this.freeCam.target= this.player.mesh.position;
            this.freeCam.upperRadiusLimit=50;
            this.freeCam.attachControl(this.engine.getRenderingCanvas(),true)
            this.scene.activeCamera= this.freeCam;
        } else if(this.inputMap["r"] || this.inputMap["ArrowDown"] || this.inputMap["ArrowUp"] || this.inputMap["ArrowRight"] || this.inputMap["ArrowLeft"]){
            this.scene.activeCamera= this.player.controller.camera
        }


        if(this.inputMap["ArrowDown"] || this.inputMap["ArrowUp"] || this.inputMap["ArrowRight"] || this.inputMap["ArrowLeft"]){
            this.notifyServer= true;
        }
        else{
            this.notifyServer= false;
        }

        if(this.notifyServer){
            console.log("here")
            this.player.state.x= this.player.mesh.position.x;
            this.player.state.y= this.player.mesh.position.y;
            this.player.state.z= this.player.mesh.position.z;
            this.player.state.rW= this.player.mesh.rotationQuaternion.w;
            this.player.state.rY= this.player.mesh.rotationQuaternion.y;
            this.player.state.room= this.value;
            this.socket.emit("playerMove", this.player.state)
        }
    }
}

export default InputController;
