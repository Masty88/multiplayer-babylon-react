import GameObject from "./GameObject";


import {
    ActionManager,
    ArcRotateCamera, Color3,
    Color4, DirectionalLight, ExecuteCodeAction,
    FreeCamera,
    Matrix, Mesh,
    MeshBuilder, Observable, PointerEventTypes,
    Quaternion, Ray, ShadowGenerator,
    StandardMaterial, TransformNode, UniversalCamera,
    Vector3
} from "@babylonjs/core";




class PlayerController extends GameObject{

    static PLAYER_SPEED= 0.2;
    static GRAVITY = -2.8;
    static JUMP_FORCE = 0.8;
    static DASH_FACTOR= 2.5;
    static DASH_TIME = 10;
    static ORIGINAL_TILT = new Vector3(0.5934119456780721, 0, 0);

    gravity = new Vector3();
    lastGroundPos = Vector3.Zero(); // keep track of the last grounded position
    playerAnimation;

    constructor(input,player, value, engine,light,shadowGenerator,profile, dispatch, changeScene) {
        super();
        this.profile= profile
        this.isJumping = false;
        this.player= player
        this.input = input;
        this.value= value
        this.engine= engine;
        this.light=light
        this.shadowGenerator= shadowGenerator;
        this.dispatch= dispatch;
        this.changeScene= changeScene;
        this.loadAnimMesh(this.profile);
        this.setupPlayerCamera();
        this.bonusGameAction()
    }

    bonusGameAction(){
        if(this.value==="BONUS_GAME"){
            //--COLLISIONS--
            this.player.mesh.actionManager = new ActionManager(this.scene);
            //Platform destination
            this.player.mesh.actionManager.registerAction(
                new ExecuteCodeAction(
                    {
                        trigger: ActionManager.OnIntersectionEnterTrigger,
                        parameter: this.scene.getMeshByName("destination")
                    },
                    () => {
                        if(this.lanternsLit == 22){
                            this.win = true;
                            //tilt camera to look at where the fireworks will be displayed
                            this._yTilt.rotation = new Vector3(5.689773361501514, 0.23736477827122882, 0);
                            this._yTilt.position = new Vector3(0, 6, 0);
                            this.camera.position.y = 17;
                        }
                    }
                )
            );

            //World ground detection
            //if player falls through "world", reset the position to the last safe grounded position
            this.player.mesh.actionManager.registerAction(
                new ExecuteCodeAction({
                        trigger: ActionManager.OnIntersectionEnterTrigger,
                        parameter: this.scene.getMeshByName("ground")
                    },
                    () => {
                        this.player.mesh.position.copyFrom(new Vector3(51,20,104)); // need to use copy or else they will be both pointing at the same thing & update together
                    }
                )
            );
            this.scene.getLightByName("sparklight").parent = this.scene.getTransformNodeByName("Empty");
        }
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

        //Super Powers in Bonus Game
        if(this.value==="BONUS_GAME"){
            PlayerController.PLAYER_SPEED=0.45
            PlayerController.JUMP_FORCE=1.2
        }else{
            PlayerController.PLAYER_SPEED=0.2;
            PlayerController.JUMP_FORCE=0.8;
        }
        //final movement that takes into consideration the inputs
        this.moveDirection = this.moveDirection.scaleInPlace(this._inputAmt * PlayerController.PLAYER_SPEED);

        //Limit of our world
        if(this.player.mesh.intersectsMesh(this.scene.getMeshByID("limit"))){
            this.player.mesh.position.z = this.player.mesh.position.z + 0.1;
        }if(this.player.mesh.intersectsMesh(this.scene.getMeshByID("limit.2"))){
            this.player.mesh.position.z = this.player.mesh.position.z -0.1;
        }if(this.player.mesh.intersectsMesh(this.scene.getMeshByID("limit.3"))){
            this.player.mesh.position.x = this.player.mesh.position.x -0.1;
        }if(this.player.mesh.intersectsMesh(this.scene.getMeshByID("limit.4"))){
            this.player.mesh.position.x = this.player.mesh.position.x +0.1;
        }

        //Go to bonus game

        if(this.scene.getMeshByName("portal")){
            if(this.player.mesh.intersectsMesh(this.scene.getMeshByName("portal"))){
                this.socket.emit("logout",this.value);
                this.changeScene.payload= "BONUS_GAME"
                this.dispatch(this.changeScene);
            }
        }

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

    async loadAnimMesh(){
        this.player.rigMesh=await this.player.loadMesh(this.profile);
        this.shadowGenerator.addShadowCaster(this.player.rigMesh.mesh); //the player mesh will cast shadows
        this.shadowGenerator.darkness=0.3;
        this.idle= this.player.mesh.idle;
        this.landing= this.player.mesh.landing;
        this.running= this.player.mesh.running;
        this.jumping= this.player.mesh.jumping;
        this.currentAnimation= null;
        this.isFalling= false;
        this.setUpAnimations()
    }

     setUpAnimations(){
        this.scene.stopAllAnimations();
       this.idle.loopAnimation= true;
       this.landing.loopAnimation= true;
       this.running.loopAnimation=true;
       this.jumping.loopAnimation= true
       this.currentAnimation= this.idle;
       this.prevAnimation= this.landing;

     }

    animatePlayer(){
        if(!this.isFalling && !this.isJumping &&
            (this.input.inputMap["ArrowUp"] || this.input.inputMap["ArrowDown"] ||
            this.input.inputMap["ArrowLeft"] || this.input.inputMap["ArrowRight"]
            )){
            this.currentAnimation= this.running;
             this.isAnimating= true
            this.isIdle= false
        }else if(!this.isFalling && this.grounded){
            this.currentAnimation= this.idle;
             this.isIdle=true
            this.isAnimating= false;
        }else if(this.isJumping && !this.isFalling){
            this.currentAnimation= this.jumping;
        }

        if(this.currentAnimation != null && this.prevAnimation !== this.currentAnimation){
            this.prevAnimation.stop();
            this.currentAnimation.play(this.currentAnimation.loopAnimation);
            this.prevAnimation = this.currentAnimation;
            this.currentAnimation.state={
                id: this.socket.id,
                animation: this.currentAnimation.name,
                x: this.player.mesh.position.x,
                y: this.player.mesh.position.y,
                z: this.player.mesh.position.z,
                rW: this.player.mesh.rotationQuaternion.w,
                rY: this.player.mesh.rotationQuaternion.y,
                room: this.value,
                mesh: this.profile,
            }
            this.socket.emit("playAnimation", this.currentAnimation.state)
        }
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
        this.animatePlayer();
    }

    activatePlayerCamera(){
        this.beforeLoop= ()=>{
            this.beforeRenderUpdate();
            this.updateCamera();
        }

        return this.camera;
    }

    updateCamera(){
      //TODO find a good rotation
            // if (this.input.verticalAxis > 0) { //rotates to the right
            //     this._camRoot.rotation = Vector3.Lerp(this._camRoot.rotation, new Vector3(this._camRoot.rotation.x, Math.PI /  2, this._camRoot.rotation.z), 0.1);
            // } else if (this.input.verticalAxis < 0) { //rotates to the left
            //     this._camRoot.rotation = Vector3.Lerp(this._camRoot.rotation, new Vector3(this._camRoot.rotation.x, -Math.PI/2, this._camRoot.rotation.z), 0.1);
            // }
        let centerPlayer = this.player.mesh.position.y + 2;
        this._camRoot.position = Vector3.Lerp(this._camRoot.position, new Vector3(this.player.mesh.position.x , centerPlayer, this.player.mesh.position.z ), 0.4);
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
        if(this.value==="BONUS_GAME"){
            yTilt.rotation= PlayerController.ORIGINAL_TILT
        }else{
            yTilt.rotation = new Vector3(0, 0, 0);
        }
        this._yTilt = yTilt;
        yTilt.parent = this._camRoot;
        if(this.value ==="BONUS_GAME"){
            this.camera= new UniversalCamera("cam", new Vector3(0,0,-30),this.scene);
            this.camera.fov = 0.47350045992678597;
            this.camera.fov = 0.47350045992678597;
        }else{
            //our actual camera that's pointing at our root's position
            this.camera=new ArcRotateCamera("Camera", 0, Math.PI/2,1, Vector3.Zero(), this.scene)
            this.camera.position=new Vector3(0, 2, -15)
            this.camera.inputs.removeByType("ArcRotateCameraKeyboardMoveInput")
            this.camera.lockedTarget = this._camRoot.position;
            this.camera.attachControl(this.engine.getRenderingCanvas(),true)
            this.camera.upperRadiusLimit=35;
            this.camera.lowerRadiusLimit=10;
            this.camera.upperBetaLimit=1.5;
            this.camera.fov = 0.35;
        }
        this.camera.parent = yTilt;
        this.scene.activeCamera = this.camera;
        return this.camera;
    }

}

export default PlayerController;
