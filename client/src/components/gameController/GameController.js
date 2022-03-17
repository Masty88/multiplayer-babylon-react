import GameObject from "./GameObject";
import EnvironmentController from "./EnvironmentController";
import PlayerController from "./PlayerController";
import {
    Color3,
    Color4, DirectionalLight, FreeCamera,
    HemisphericLight,
    Matrix,
    Mesh,
    MeshBuilder, PointLight,
    Quaternion, Scene, SceneLoader, ShadowGenerator, SpotLight,
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
        this.engine= engine;
        this.value= value;
        this.players={};
        this.handleScene(scene,socket)
    }


    handleSocket(scene,socket){
        socket.on("newPlayerCreated",(data)=>{
            this.createPlayer(scene,socket,data)
            console.log("Player")
            });
        socket.on("anotherPlayerMove", (data)=>{
            this.player= this.players[data.id];
            this.player.setState(data)
        })
        socket.on("anotherPlayerAnimated",(data)=>{
            this.player= this.players[data.id];
            if(data.animation !== null){
                this.player.mesh[data.animation].loopAnimation= true
                this.player.mesh[data.animation].stop()
                this.player.mesh[data.animation].play(this.player.mesh[data.animation].loopAnimation)
            }
        })
    }

    handleScene(scene,socket){
        if(this.value==="GO_TO_START"){
            this.goToStart(scene,socket)
        }
        if(this.value=== "START_CITY" ){
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
         console.log(guiMenu)
        // guiMenu.idealHeight = 720; //fit our fullscreen ui to this height

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
        this.handleSocket(scene,socket)
    }

    loadCharacterAsync(scene,socket){
        this.light0 = new DirectionalLight("dir01", new Vector3(-1, -2, -1), scene);
        this.light0.position = new Vector3(20, 40, 0);
        this.light0.intensity = 5;
        const light1 = new HemisphericLight("HemiLight", new Vector3(0, 1, 0), scene);
        light1.intensity=0.8;
        this.shadowGenerator= new ShadowGenerator(1000,this.light0)
        this.createPlayer(scene,socket)
    }

   async createPlayer(scene,socket,data){
        //Create the player

            this.player =  new PlayerCreator( this.engine,this.light0);
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
             console.log(this.players.length)
             this.rigMesh=await this.player.loadMesh();
             // console.log(this.rigMesh)
             // this.shadowGenerator2=new ShadowGenerator(1000,this.light0);
             this.shadowGenerator.addShadowCaster(this.rigMesh.mesh)
             this.player.setState(data);
             this.player.startSocket= true;
            }else{
              socket.emit("playerCreated", this.player.state);
                  this.input= new InputController(socket,this.player, this.value,this.engine);
                  this.player.controller=  new PlayerController(this.input,this.player,this.value,this.engine,this.light0,this.shadowGenerator);
                  this.player.controller.activatePlayerCamera()
                  this.player.startSocket= true;
            }
    }

}



export default GameController;
