import GameObject from "./GameObject";
import EnvironmentController from "./EnvironmentController";
import PlayerController from "./PlayerController";
import {
    Color3,
    Color4,
    HemisphericLight,
    Matrix,
    Mesh,
    MeshBuilder, PointLight,
    Quaternion, ShadowGenerator,
    StandardMaterial,
    Vector3
} from "@babylonjs/core";
import InputController from "./InputController";
import io from "socket.io-client";



class GameController {
    constructor(scene) {
        // Initialization
        GameObject.GameController = this;
        GameObject.Scene = scene;
        this.scene = scene;
        this.input= new InputController();
        this.game={}
        this.gameOver= false;
        this.players={};
        this.connectToServer(scene);
    }


    async connectToServer(scene){
        console.log("connect")
        const socket = io.connect('http://localhost:4000');
        socket.on("connect",()=>{
            console.log("connection established")
                  socket.on("GetId",async (data)=>{
                    this.game.id=data.id;
                    this.setUpGame().then(r => this.initializeGameAsync(scene,socket))
                    socket.emit("signalSend",{})
                  })
        })
        socket.on("newPlayerCreated",async (data)=>{
          console.log(this.players)
          await this.createPlayer(scene,socket,data)
      })
    }

    async setUpGame(){
        console.log("here2")
        const environment= new EnvironmentController()
        this.environment= environment;
        await this.environment.load()
    }

    async createPlayer(scene,socket,data){
        const light = new PointLight("sparklight", new Vector3(0, -1, 0), scene);
        light.diffuse = new Color3(0.08627450980392157, 0.10980392156862745, 0.15294117647058825);
        light.intensity = 10;
        light.radius = 1;

        const shadowGenerator = new ShadowGenerator(1024, light);
        shadowGenerator.darkness = 100;

        //Create the player
        let color= new Color3.Yellow();
        this.player = new PlayerController(shadowGenerator,this.input,color,socket);
        const camera=  this.player.activatePlayerCamera();
        this.player.state={
            id: this.game.id,
            // x:  this.player.mesh.position.x,
            // y:  this.player.mesh.position.y,
            // z:  this.player.mesh.position.z,
            // rX: this.player.mesh.rotation.x,
            // rY: this.player.mesh.rotation.y,
            // rZ: this.player.mesh.rotation.z,
        }
        // this.player.setPlayerState=(data)=>
        // {
        //     this.player.mesh.position.x = data.x;
        //     this.player.mesh.position.y = data.y;
        //     this.player.mesh.position.z = data.z;
        //     this.player.mesh.rotation.x = data.rX;
        //     this.player.mesh.rotation.y = data.rY;
        //     this.player.mesh.rotation.z = data.rZ;
        // }
        if(data){
            let color= new Color3.Red();
            this.players[data.id]=this.player;
            // this.player.setPlayerState(data)
            console.log(`Another player created with ${data.id}`)
        }else{
            console.log("I'm created")
        socket.emit("playerCreation",this.player.state)
        }
    }

    async initializeGameAsync(scene,socket){
        console.log(this.game.id)
        //temporary light to light the entire scene
        const light0 = new HemisphericLight("HemiLight", new Vector3(0, 1, 0), scene);
        light0.intensity=0.5;
        await this.createPlayer(scene,socket)
        // console.log(this.player.isGameOver())
        // if(this.player.isGameOver()){
        //   this.gameOver= true;
        // }
    }




}

export default GameController;
