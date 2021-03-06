import GameObject from "./GameObject";
import EnvironmentController from "./EnvironmentController";
import PlayerController from "./PlayerController";
import {
    Color3,
    Color4, DirectionalLight, FreeCamera, GlowLayer,
    HemisphericLight, PointLight,
    ShadowGenerator,
    Vector3
} from "@babylonjs/core";
import InputController from "./InputController";
import PlayerCreator from "./PlayerCreator";
import {AdvancedDynamicTexture, Button, Control} from "@babylonjs/gui";
import uiController from "./UiController";
import UiBonusGameController from "./UiBonusGameController";


class GameController {

    constructor(scene,socket,engine,value,dispatch,changeScene,logout,resetProfile,profile) {
        // Initialization
        GameObject.GameController = this;
        GameObject.Scene = scene;
        GameObject.Socket= socket
        scene.collisionsEnabled= true;
        this.profile=profile;
        this.changeScene= changeScene;
        this.logout=logout;
        this.resetProfile= resetProfile;
        this.dispatch= dispatch;
        this.engine= engine;
        this.value= value;
        this.players={};
        this.handleScene(scene,socket)
    }


    handleSocket(scene,socket){
        socket.on("newPlayerCreated",(data)=>{
                this.createPlayer(scene,socket,data)
            });
        socket.on("anotherPlayerMove", (data)=>{
                this.player= this.players[data.id];
                this.player.setState(data)
        })
        socket.on("anotherPlayerAnimated",(data)=>{
            this.player= this.players[data.id];
            if(data.animation !== null && this.player){
                this.player.mesh[data.animation].loopAnimation= true
                this.player.mesh[data.animation].stop()
                this.player.mesh[data.animation].play(this.player.mesh[data.animation].loopAnimation)
            }
        })
        socket.on("playerExit",(data)=>{
            this.player= this.players[data]
            if(this.player){
                this.player.mesh.dispose();
                delete this.players[data]
            }
        })
    }

    handleScene(scene,socket){

        if(this.value==="GO_TO_START"){
            this.goToStart(scene,socket)
        }
        if(this.value=== "START_CITY" ){
            this.goToCutScene(scene,socket,socket)
            this.city= "start_town_blend.glb";
            socket.connect();
            socket.emit("join_start_town", {room:this.value, userId: this.user})
        }
        if(this.value==="DESERT"){
            this.goToCutScene(scene,socket,socket)
            socket.connect();
            this.city= "desert_town_blend.glb"
            socket.emit("join_start_town", {room:this.value, userId: this.user})
        }
        if(this.value==="BONUS_GAME"){
            this.goToCutScene(scene,socket,socket)
            this.city= "bonus_game.glb";
            socket.disconnect();
        }
    }

    async goToStart(scene,socket){
        this.engine.displayLoadingUI();
        scene.clearColor=new Color4(0,0,0,1);
        let camera = new FreeCamera("camera1", new Vector3(0, 0, 0), scene);
        camera.setTarget(Vector3.Zero());

        this.changeScene.payload="START_CITY"
        this.dispatch(this.changeScene);

        //--SCENE FINISHED LOADING--
        await scene.whenReadyAsync();
        this.engine.hideLoadingUI();
        scene.dispose()
    }


    async goToCutScene(scene,socket){
        this.engine.displayLoadingUI();
        let camera = new FreeCamera("camera1", new Vector3(0, 0, 0),scene);
        camera.setTarget(Vector3.Zero());
        scene.clearColor = new Color4(0, 0, 0, 1);

        await scene.whenReadyAsync();
        let finishedLoading = false;

        await this.setUpGame(scene,socket).then(res =>{
            finishedLoading = true;
        })
    }

    async setUpGame(scene,socket){
        const ui= new uiController(this.dispatch, this.logout, socket,this.changeScene,this.value, this.resetProfile,this.profile, this.resetProfile)
        const environment= new EnvironmentController(this.city,this.player)
        this.environment= environment;
        await this.environment.load()
        await this.loadCharacterAsync(scene,socket)
        this.handleSocket(scene,socket)
        if(this.value==="BONUS_GAME") {
            this.environment.checkLanterns(this.player);
            const uiBonus = new UiBonusGameController(this.dispatch,this.changeScene);
            scene.onBeforeRenderObservable.add(() => {
                //reset the sparkler timer
                if (this.player.sparkReset) {
                    this.player.sparkReset = false;
                    uiBonus.updateLanternCount(this.player.lanternsLit);
                }
                uiBonus.updateUI()
            })
            //glow layer
            const gl = new GlowLayer("glow", scene);
            gl.intensity = 0.4;
            this.environment._lanternObjs.forEach(lantern => {
                gl.addIncludedOnlyMesh(lantern.mesh);
            });
        }
    }

    loadCharacterAsync(scene,socket){
        if(this.value==="BONUS_GAME"){
            //temporary light to light the entire scene
            this.light1 = new HemisphericLight("HemiLight", new Vector3(0, 1, 0), scene);
            this.light1.intensity=0.9
            this.light0 = new PointLight("sparklight", new Vector3(0, 0, 0), scene);
            this.light0.diffuse = new Color3(0.08627450980392157, 0.10980392156862745, 0.15294117647058825);
            this.light0.intensity = 35;
            this.light0.radius = 1;
        }else{
            this.light0 = new DirectionalLight("dir01", new Vector3(-1, -2, -1), scene);
            this.light0.position = new Vector3(20, 40, 0);
            this.light0.intensity = 5;
            const light1 = new HemisphericLight("HemiLight", new Vector3(0, 1, 0), scene);
            light1.intensity=0.8;
        }
        this.createPlayer(scene,socket)
    }

   async createPlayer(scene,socket,data){
        //Create the player
            this.player =  new PlayerCreator( this.engine,this.value);
            this.player.state={
                id: socket.id,
                x: this.player.mesh.position.x,
                y: this.player.mesh.position.y,
                z: this.player.mesh.position.z,
                rW: this.player.mesh.rotationQuaternion.w,
                rY: this.player.mesh.rotationQuaternion.y,
                room: this.value,
                mesh: this.profile.mesh,
            }
            this.player.setState=(data)=>{
                this.player.mesh.position.x = data.x;
                this.player.mesh.position.y = data.y;
                this.player.mesh.position.z = data.z;
                this.player.mesh.rotationQuaternion.w= data.rW;
                this.player.mesh.rotationQuaternion.y= data.rY;
                this.player.state.room=data.room;
                this.player.state.mesh= this.profile.mesh;
            }
            if(data ){
             this.players[data.id]= this.player;
             this.rigMesh=await this.player.loadMesh(data.mesh);
             this.shadowGenerator.addShadowCaster(this.rigMesh.mesh)
             this.player.setState(data);
             this.player.startSocket= true;
            }else{
                this.shadowGenerator= new ShadowGenerator(1000,this.light0)
              socket.emit("playerCreated", this.player.state);
                  this.input= new InputController(socket,this.player, this.value,this.engine,this.dispatch,this.logout,this.resetProfile);
                  this.player.controller=  new PlayerController(this.input,
                      this.player,
                      this.value,
                      this.engine,
                      this.light0,
                      this.shadowGenerator,
                      this.profile.mesh,
                      this.dispatch,
                      this.changeScene
                      );
                  this.player.controller.activatePlayerCamera()
            }

    }

}

export default GameController;
