import GameObject from "./GameObject";


import {
    ArcRotateCamera, Color3,
    Color4,
    FreeCamera,
    Matrix, Mesh,
    MeshBuilder, Observable,
    Quaternion, Ray,
    StandardMaterial, TransformNode, UniversalCamera,
    Vector3
} from "@babylonjs/core";




class PlayerController extends GameObject{

    static PLAYER_SPEED= 0.10;
    static GRAVITY = -2.8;
    static JUMP_FORCE = 0.8;
    static DASH_FACTOR= 2.5;
    static DASH_TIME = 10;

    gravity = new Vector3();
    lastGroundPos = Vector3.Zero(); // keep track of the last grounded position
    playerAnimation;

    constructor(input,player, value, engine) {
        super();
        this.setupPlayerCamera();
        this.isJumping = false;
        this.player= player
        this.input = input;
        this.value= value
        this.engine= engine;

        // //Player Animation
        console.log(this.player.rigMesh.animationGroups)
         this.idle= this.player.rigMesh.animationGroups;
        console.log(this.idle)
        // this.landing= this.player.mesh.landing;
        // this.walking= this.player.mesh.walking;
        // this.currentAnimation= null;
        // this.isFalling= false;
        // this.setUpAnimations()
        this.scene.getLightByName("sparklight").parent = this.scene.getTransformNodeByName("Empty");
    }

    updateFromControl(){
        this.deltaTime = this.scene.getEngine().getDeltaTime() / 1000.0;
        this.moveDirection = Vector3.Zero(); // vector that holds movement information
        this.h = this.input.horizontal; //x-axis
        this.v = this.input.vertical; //z-axis

        //Movement based on Camera
        let fwd = this._camRoot.forward;
        let right = this._camRoot.right;
        let correctedVertical = fwd.scaleInPlace(this.v);
        let correctedHorizontal = right.scaleInPlace(this.h);
        //movement based off of camera's view
        let move = correctedHorizontal.addInPlace(correctedVertical);

        this.moveDirection = new Vector3(move.normalize().x, 0, move.normalize().z);


        //clamp the input value so that diagonal movement isn't twice as fast
        let inputMag = Math.abs(this.h) + Math.abs(this.v);
        if (inputMag < 0) {
            this._inputAmt = 0;
        } else if (inputMag > 1) {
            this._inputAmt = 1;
        } else {
            this._inputAmt = inputMag;
        }

        //final movement that takes into consideration the inputs
        this.moveDirection = this.moveDirection.scaleInPlace(this._inputAmt * PlayerController.PLAYER_SPEED);


        //Rotations
        //check if there is movement to determine if rotation is needed
        let input = new Vector3(this.input.horizontalAxis, 0, this.input.verticalAxis); //along which axis is the direction
        if (input.length() === 0) {//if there's no input detected, prevent rotation and keep player in same rotation
            return;
        }
        //rotation based on input & the camera angle
        let angle = Math.atan2(this.input.horizontalAxis, this.input.verticalAxis);
        angle += this._camRoot.rotation.y;
        let targ = Quaternion.FromEulerAngles(0, angle, 0);
        this.player.mesh.rotationQuaternion = Quaternion.Slerp(this.player.mesh.rotationQuaternion, targ, 10 * this.deltaTime);
    }

     setUpAnimations(){
       //  this.scene.stopAllAnimations();
       // this.idle.loopAnimation= true;
       // this.landing.loopAnimation= true;
       // this.walking.loopAnimation=true;
       // this.currentAnimation= this.idle;
       // this.prevAnimation= this.landing;
       // this.isAnimating=false;
    }

    animatePlayer(){
        //
        // if(!this.isFalling && !this.isJumping &&
        //     (this.input.inputMap["ArrowUp"] || this.input.inputMap["ArrowDown"] ||
        //     this.input.inputMap["ArrowLeft"] || this.input.inputMap["ArrowRight"]
        //     )){
        //     this.currentAnimation= this.walking;
        //      this.isAnimating= true
        //     this.isIdle= false
        // }else if(!this.isFalling && this.grounded){
        //     this.currentAnimation= this.idle;
        //      this.isIdle=true
        //     this.isAnimating= false;
        // }
        //
        // this.currentAnimation.state={
        //     id: this.socket.id,
        //     animation: null,
        //     room: this.value,
        // }
        //
        // if(this.currentAnimation != null && this.prevAnimation !== this.currentAnimation){
        //     this.prevAnimation.stop();
        //     this.currentAnimation.play(this.currentAnimation.loopAnimation);
        //     this.prevAnimation = this.currentAnimation;
        // }

        // if(this.isAnimating) {
        //     console.log("here")
        //     if(this.isIdle){
        //             this.currentAnimation.state.animation= "idle";
        //     }else{
        //             this.currentAnimation.state.animation= this.currentAnimation.name;
        //         }
        //     this.socket.emit("playAnimation", this.currentAnimation.state)
        // }
        // else{
        //     this.currentAnimation.state.animation= null;
        //     this.socket.emit("playAnimation", this.currentAnimation.state);
        // }
    }

    floorRayCast(offsetx, offsetz, raycastlen){
        let raycastFloorPos = new Vector3(this.player.mesh.position.x + offsetx, this.player.mesh.position.y + 0.5, this.player.mesh.position.z + offsetz);
        let ray = new Ray(raycastFloorPos, Vector3.Up().scale(-1), raycastlen);
        let predicate = function (mesh) {
            return mesh.isPickable && mesh.isEnabled();
        }
        let pick = this.scene.pickWithRay(ray, predicate);
        if (pick.hit) {
            return pick.pickedPoint;
        } else {
            return Vector3.Zero();
        }
    }

    isGrounded(){
        if(this.floorRayCast(0,0,0.6).equals(Vector3.Zero())){
            return false
        }else{
            return true;
        }
    }

    updateGroundDetection(){
        if(!this.isGrounded()){
            this.gravity= this.gravity.addInPlace(Vector3.Up().scale(this.deltaTime * PlayerController.GRAVITY));
            this.grounded = false;
        }
        if (this.gravity.y < -PlayerController.JUMP_FORCE) {
            this.gravity.y = -PlayerController.JUMP_FORCE;
        }

        if (this.gravity.y < 0 && this.isJumping) { //todo: play a falling anim if not grounded BUT not on a slope
            this.isFalling = true;
        }

        this.player.mesh.moveWithCollisions(this.moveDirection.addInPlace(this.gravity));

        if (this.isGrounded()) {
            this.gravity.y = 0;
            this.grounded = true;
            this.lastGroundPos.copyFrom(this.player.mesh.position);
            this.jumpCount = 1;
            this.isJumping=false
            this.isFalling= false;
        }

        //Jump detection
        if(this.input.jumpKeyDown && this.jumpCount > 0) {
            this.gravity.y = PlayerController.JUMP_FORCE;
            this.jumpCount--;
            this.isJumping= true;
            this.isFalling= false;
        }

        if(this.isJumping){
            this.player.state.x= this.player.mesh.position.x;
            this.player.state.y= this.player.mesh.position.y;
            this.player.state.z= this.player.mesh.position.z;
            this.player.state.rW= this.player.mesh.rotationQuaternion.w;
            this.player.state.rY= this.player.mesh.rotationQuaternion.y;
            this.socket.emit("playerMove", this.player.state)
        }
    }

    beforeRenderUpdate(){
        this.updateFromControl();
        this.updateGroundDetection();
         // this.animatePlayer();
    }

    activatePlayerCamera(){
        this.beforeLoop= ()=>{
            this.beforeRenderUpdate();
            this.updateCamera();
        }

        return this.camera;
    }

    updateCamera(){
        //trigger areas for rotating camera view
        // if (this.player.mesh.intersectsMesh(this.scene.getMeshByName("cornerTrigger_primitive1"))) {
        //     if (this.input.horizontalAxis > 0) { //rotates to the right
        //         console.log("here")
        //         this._camRoot.rotation = Vector3.Lerp(this._camRoot.rotation, new Vector3(this._camRoot.rotation.x, Math.PI / 2, this._camRoot.rotation.z), 0.4);
        //     } else if (this.input.horizontalAxis < 0) { //rotates to the left
        //         this._camRoot.rotation = Vector3.Lerp(this._camRoot.rotation, new Vector3(this._camRoot.rotation.x, Math.PI, this._camRoot.rotation.z), 0.4);
        //     }
        // }

        let centerPlayer = this.player.mesh.position.y + 2;
        this._camRoot.position = Vector3.Lerp(this._camRoot.position, new Vector3(this.player.mesh.position.x, centerPlayer, this.player.mesh.position.z), 0.4);
    }

    setupPlayerCamera() {

        //root camera parent that handles positioning of the camera to follow the player
        this._camRoot = new TransformNode("root");
        this._camRoot.position = new Vector3(0, 0, 0); //initialized at (0,0,0)
        //to face the player from behind (180 degrees)
        this._camRoot.rotation = new Vector3(0, Math.PI, 0);

        //rotations along the x-axis (up/down tilting)
        let yTilt = new TransformNode("ytilt");
        //adjustments to camera view to point down at our player
        yTilt.rotation = new Vector3(0.5934119456780721, 0, 0);
        this._yTilt = yTilt;
        yTilt.parent = this._camRoot;

        //our actual camera that's pointing at our root's position
        this.camera = new UniversalCamera("cam", new Vector3(0, 0, -30), this.scene);
        // this.camera= new FreeCamera("cam", new Vector3.Zero(), this.scene )
         this.camera.lockedTarget = this._camRoot.position;
        this.camera.fov = 0.47350045992678597;
         // this.camera.attachControl(this.scene);
        this.camera.parent = yTilt;

        this.scene.activeCamera = this.camera;
        return this.camera;
    }

}

export default PlayerController;
