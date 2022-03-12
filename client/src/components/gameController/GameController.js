import GameObject from "./GameObject";
import EnvironmentController from "./EnvironmentController";
import PlayerController from "./PlayerController";
import {
    Color3,
    Color4, FreeCamera,
    HemisphericLight,
    Matrix,
    Mesh,
    MeshBuilder, PointLight,
    Quaternion, Scene, SceneLoader, ShadowGenerator,
    StandardMaterial, UniversalCamera,
    Vector3
} from "@babylonjs/core";
import InputController from "./InputController";
import PlayerCreator from "./PlayerCreator";
import {AdvancedDynamicTexture, Button, Control} from "@babylonjs/gui";
import UiController from "./UiController";
import uiController from "./UiController";


class GameController {

    constructor(scene,socket,engine,value,dispatch,changeScene,logout) {
        // Initialization
        GameObject.GameController = this;
        GameObject.Scene = scene;
        GameObject.Socket= socket
        this.changeScene= changeScene
        this.logout=logout
        this.dispatch= dispatch;
        this.engine= engine
        this.value= value;
        this.players={};
        this.handleScene(scene,socket)
    }


    handleSocket(scene,socket){
        socket.on("newPlayerCreated",(data)=>{
            this.createPlayer(scene,socket,data)
            });
        socket.on("anotherPlayerMove",(data)=>{
                this.player=this.players[data.id];
                this.player.setState(data)
            })
       socket.on("anotherPlayerAnimated",async (data)=>{
           // console.log(scene.animationGroups)
           // console.log(data.id)
           //  const animation= scene.animationGroups.filter(animation=> animation.name === data.animation && animation.uniqueId == "456")
           // console.log(animation)
           // scene.animation.start()
           // console.log(data)
           // this.player=this.players[data.id];
           // console.log(this.player)
           //console.log(data.currentAnimation)
           // console.log(scene.animationGroups[5])
           // scene.animationGroups[5].start()
           // if(data.animation !== null){
           //      this.player=this.players[data.id];
           //      console.log(data.currentAnimation)
           //  }
        })
    }

    handleScene(scene,socket){
        if(this.value==="GO_TO_START"){
            this.goToStart(scene,socket)
        }
        if(this.value=== "START_CITY" ){
            this.handleSocket(scene,socket)
            this.goToCutScene(scene,socket,socket)
            socket.emit("join_start_town", this.value)
        }
    }

    async goToStart(scene){
        this.engine.displayLoadingUI();
        scene.clearColor=new Color4(0,0,0,1);
        let camera = new FreeCamera("camera1", new Vector3(0, 0, 0), scene);
        camera.setTarget(Vector3.Zero());

        //create a fullscreen ui for all of our GUI elements
        const guiMenu = AdvancedDynamicTexture.CreateFullscreenUI("UI");
        guiMenu.idealHeight = 720; //fit our fullscreen ui to this height

        //create a simple button
        const startBtn = Button.CreateSimpleButton("start", "PLAY");
        startBtn.width = 0.2
        startBtn.height = "40px";
        startBtn.color = "white";
        startBtn.top = "-14px";
        startBtn.thickness = 0;
        startBtn.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        guiMenu.addControl(startBtn);

        //this handles interactions with the start button attached to the scene
        startBtn.onPointerDownObservable.add(() => {
            this.changeScene.payload="START_CITY"
            this.dispatch(this.changeScene);
        });

        //--SCENE FINISHED LOADING--
        await scene.whenReadyAsync();
        this.engine.hideLoadingUI();
    }


    async goToCutScene(scene,socket){
        this.engine.displayLoadingUI();
        let camera = new FreeCamera("camera1", new Vector3(0, 0, 0),scene);
        camera.setTarget(Vector3.Zero());
        scene.clearColor = new Color4(0, 0, 0, 1);

        //--GUI--
        const cutScene = AdvancedDynamicTexture.CreateFullscreenUI("cutscene");

        //--PROGRESS DIALOGUE--
        const next = Button.CreateSimpleButton("next", "loading...");
        next.color = "white";
        next.thickness = 0;
        next.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        next.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
        next.width = "164px";
        next.height = "64px";
        next.top = "-3%";
        next.left = "-12%";
        cutScene.addControl(next)

        await scene.whenReadyAsync();
        let finishedLoading = false;

        await this.setUpGame(scene,socket).then(res =>{
            cutScene.removeControl(next)
            finishedLoading = true;
        })
    }

    async setUpGame(scene,socket){
        const ui= new uiController(this.dispatch,this.logout, socket )
        const environment= new EnvironmentController(scene)
        this.environment= environment;
        await this.environment.load()
        await this.loadCharacterAsync(scene,socket)

    }

    async loadCharacterAsync(scene,socket){
        const light0 = new HemisphericLight("HemiLight", new Vector3(0, 1, 0), scene);
        light0.intensity=0.8;
        await this.createPlayer(scene,socket)
    }

     async createPlayer(scene,socket,data){
            const light = new PointLight("sparklight", new Vector3(0, -1, 0), scene);
            light.diffuse = new Color3(0.08627450980392157, 0.10980392156862745, 0.15294117647058825);
            light.intensity = 10;
            light.radius = 1;

            const shadowGenerator = new ShadowGenerator(1024, light);
            shadowGenerator.darkness = 100;

            //Create the player
            this.player =  new PlayerCreator(shadowGenerator, this.engine);
             await this.player.loadMesh(shadowGenerator);
            this.player.state={
                id: socket.id,
                x: this.player.mesh.position.x,
                y: this.player.mesh.position.y,
                z: this.player.mesh.position.z,
                rW: this.player.mesh.rotationQuaternion.w,
                rY: this.player.mesh.rotationQuaternion.y,
                room: this.value,
            }
            this.player.setState=(data)=>{
                this.player.mesh.position.x = data.x;
                this.player.mesh.position.y = data.y;
                this.player.mesh.position.z = data.z;
                this.player.mesh.rotationQuaternion.w= data.rW;
                this.player.mesh.rotationQuaternion.y= data.rY;
                this.player.state.room=this.value;
            }
            if(data){
             this.players[data.id]= this.player;
             this.player.setState(data);
            }else{
              socket.emit("playerCreated", this.player.state);
              this.input= new InputController(socket,this.player, this.value);
              this.player.controller= new PlayerController(this.input,this.player,this.value);
              this.player.controller.activatePlayerCamera();
              console.log(this.player.mesh)
            }
    }

}



export default GameController;
