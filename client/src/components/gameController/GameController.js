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
    Quaternion, Scene, ShadowGenerator,
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
            })
            socket.on("anotherPlayerMove",(data)=>{
                this.player=this.players[data.id];
                this.player.setState(data)
            })
    }

    handleScene(scene,socket){
        if(this.value==="GO_TO_START"){
            this.goToStart(scene,socket)
        }
        if(this.value=== "START_CITY" ){
            this.handleSocket(scene,socket)
            this.goToCutScene(scene,socket,socket)
            console.log(socket.id)
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
        this.engine.hideLoadingUI();

        let finishedLoading = false;
        await this.setUpGame(scene,socket).then(res =>{
            cutScene.removeControl(next)
            finishedLoading = true;
        })
    }

    async setUpGame(scene,socket){
        // const playerUI = AdvancedDynamicTexture.CreateFullscreenUI("UI");
        // this.playerUI = playerUI;
        // this.playerUI.idealHeight = 720;
        // const logOutBtn = Button.CreateSimpleButton("start", "LOGOUT");
        // logOutBtn.width = "48px";
        // logOutBtn.color= "white"
        // logOutBtn.height = "86px";
        // logOutBtn.thickness = 10;
        // logOutBtn.verticalAlignment = 0;
        // logOutBtn.horizontalAlignment = 1;
        // logOutBtn.top = "-16px";
        // playerUI.addControl(logOutBtn);
        // logOutBtn.zIndex = 10;
        // this.logOutBtn = logOutBtn;
        // //when the button is down, make pause menu visable and add control to it
        // logOutBtn.onPointerDownObservable.add(() => {
        //     this.dispatch(this.logout)
        // });
        const ui= new uiController(this.dispatch,this.logout)
        const environment= new EnvironmentController(scene)
        this.environment= environment;
        await this.environment.load()
        await this.loadCharacterAsync(scene,socket)

    }

    async loadCharacterAsync(scene,socket){
        const light0 = new HemisphericLight("HemiLight", new Vector3(0, 1, 0), scene);
        light0.intensity=0.5;
        this.createPlayer(scene,socket)
    }

    createPlayer(scene,socket,data){
            const light = new PointLight("sparklight", new Vector3(0, -1, 0), scene);
            light.diffuse = new Color3(0.08627450980392157, 0.10980392156862745, 0.15294117647058825);
            light.intensity = 10;
            light.radius = 1;
            const shadowGenerator = new ShadowGenerator(1024, light);
            shadowGenerator.darkness = 100;
            //Create the player
            this.player = new PlayerCreator(shadowGenerator);
            this.player.state={
                id: socket.id,
                x: this.player.mesh.position.x,
                y: this.player.mesh.position.y,
                z: this.player.mesh.position.z,
                rW: this.player.mesh.rotationQuaternion.w,
                rY: this.player.mesh.rotationQuaternion.y
            }
            this.player.setState=(data)=>{
                this.player.mesh.position.x = data.x;
                this.player.mesh.position.y = data.y;
                this.player.mesh.position.z = data.z;
                this.player.mesh.rotationQuaternion.w= data.rW;
                this.player.mesh.rotationQuaternion.y= data.rY;
            }
            if(data){
             this.players[data.id]= this.player;
             this.player.setState(data);
            }else{
              socket.emit("playerCreated", this.player.state);
              this.input= new InputController(socket,this.player);
              this.player.controller= new PlayerController(this.input,this.player,socket);
              this.player.controller.activatePlayerCamera();
            }

    }
}



export default GameController;