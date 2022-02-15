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
    Quaternion, ShadowGenerator,
    StandardMaterial, UniversalCamera,
    Vector3
} from "@babylonjs/core";
import InputController from "./InputController";
import PlayerCreator from "./PlayerCreator";




class GameController {
    constructor(scene,socket) {
        // Initialization
        GameObject.GameController = this;
        GameObject.Scene = scene;
        this.scene = scene;
        this.game={}
        this.gameOver= false;
        this.players={};
        this.setUpGame().then(r => this.initializeGameAsync(scene,socket))
    }

    handleSocket(scene,socket){
        socket.on("newPlayerCreated",(data)=>{
            this.createPlayer(scene,socket,data)
        })
        socket.on("anotherPlayerMove",(data)=>{
            this.player=this.players[data.id];
            this.player.setState(data)
        })
        return()=>{
            socket.off("newPlayerCreated",(data)=>{
                console.log("off")
                this.createPlayer(scene,socket,data)
            })
        }
    }
    async setUpGame(){
        const environment= new EnvironmentController()
        this.environment= environment;
        await this.environment.load()
    }

    createPlayer(scene,socket,data){
        console.log("count")
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
                rX: this.player.mesh.rotation.x,
                rY: this.player.mesh.rotation.y,
                rZ: this.player.mesh.rotation.z,
            }
            this.player.setState=(data)=>{
                this.player.mesh.position.x = data.x + 5;
                this.player.mesh.position.y = data.y;
                this.player.mesh.position.z = data.z;
                this.player.mesh.rotation.x = data.rX;
                this.player.mesh.rotation.y = data.rY;
                this.player.mesh.rotation.z = data.rZ;
            }
            if(data){
             this.players[data.id]= this.player;
             this.player.setState(data)

            }else{
                socket.emit("playerCreated", this.player.state);
            }
             this.input= new InputController(socket,this.player);
            this.player.controller= new PlayerController(this.input,this.player)
            this.player.controller.activatePlayerCamera()
    }

    async initializeGameAsync(scene,socket){
        //temporary light to light the entire scene
        console.log(socket.id)
        let tempCamera= new FreeCamera('camera1', new Vector3(0, 5, -10), scene)
        tempCamera.setTarget( Vector3.Zero())
        const light0 = new HemisphericLight("HemiLight", new Vector3(0, 1, 0), scene);
        light0.intensity=0.5;
        this.createPlayer(scene,socket)
        this.handleSocket(scene,socket)
    }
}



export default GameController;
