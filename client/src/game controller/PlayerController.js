import GameObject from "./GameObject";


import {
    ArcRotateCamera, Color3,
    Color4,
    FreeCamera,
    Matrix, Mesh,
    MeshBuilder,
    Quaternion, Ray,
    StandardMaterial, TransformNode, UniversalCamera,
    Vector3
} from "@babylonjs/core";




class PlayerController extends GameObject{

    static PLAYER_SPEED= 0.45;
    static GRAVITY = -2.8;
    static JUMP_FORCE = 0.8

    gravity = new Vector3();
    lastGroundPos = Vector3.Zero(); // keep track of the last grounded position

    constructor(shadowGenerator,input,color) {
        super();
        this.setupPlayerCamera();
        this.loadCharacterAssets(shadowGenerator,color)
        this.input = input;
    }

    loadCharacterAssets(shadowGenerator,color){
        this.mesh = MeshBuilder.CreateBox("outer", {width: 2, depth: 1, height: 3});
        this.mesh.isVisible = false;
        this.mesh.isPickable = false;
        this.mesh.checkCollisions = true;


        //move origin of box collider to the bottom of the mesh (to match player mesh)
        this.mesh.bakeTransformIntoVertices(Matrix.Translation(0, 1.5, 0))

        //for collisions
        this.mesh.ellipsoid = new Vector3(1, 1.5, 1);
        this.mesh.ellipsoidOffset = new Vector3(0, 1.5, 0);

        this.mesh.rotationQuaternion = new Quaternion(0, 1, 0, 0); // rotate the player mesh 180 since we want to see the back of the player
        this.mesh.position= new Vector3(0,0,0)

        const box = MeshBuilder.CreateBox("Small1", {
            width: 0.5,
            depth: 0.5,
            height: 0.25,
            faceColors: [new Color4(0, 0, 0, 1), new Color4(0, 0, 0, 1), new Color4(0, 0, 0, 1), new Color4(0, 0, 0, 1), new Color4(0, 0, 0, 1), new Color4(0, 0, 0, 1)]
        });
        box.position.y = 0.5;
        box.position.z = 1;

        const body = Mesh.CreateCylinder("body", 3, 2, 2, 0, 0);
        const bodymtl = new StandardMaterial("red");
        bodymtl.diffuseColor = color;
        body.material = bodymtl;
        body.isPickable = false;
        body.bakeTransformIntoVertices(Matrix.Translation(0, 1.5, 0)); // simulates the imported mesh's origin

        //parent the meshes
        box.parent = body;
        body.parent = this.mesh;
        shadowGenerator.addShadowCaster(this.mesh); //the player mesh will cast shadows
    }

    floorRayCast(offsetx, offsetz, raycastlen){
        let raycastFloorPos = new Vector3(this.mesh.position.x + offsetx, this.mesh.position.y + 0.5, this.mesh.position.z + offsetz);
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
        this.mesh.moveWithCollisions(this.moveDirection.addInPlace(this.gravity));
        if (this.isGrounded()) {
            this.gravity.y = 0;
            this.grounded = true;
            this.lastGroundPos.copyFrom(this.mesh.position);
        }
    }

    updateFromControl(){
        this.deltaTime = this.scene.getEngine().getDeltaTime() / 1000.0;
        this.moveDirection = Vector3.Zero(); // vector that holds movement information
        this.h = this.input.horizontal; //x-axis
        this.v = this.input.vertical; //z-axis

        let fwd = this._camRoot.forward;
        let right = this._camRoot.right;
        let correctedVertical = fwd.scaleInPlace(this.v);
        let correctedHorizontal = right.scaleInPlace(this.h);
        //movement based off of camera's view
        let move = correctedHorizontal.addInPlace(correctedVertical);

        this.moveDirection = new Vector3((move).normalize().x, 0, (move).normalize().z);

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
        this.mesh.rotationQuaternion = Quaternion.Slerp(this.mesh.rotationQuaternion, targ, 10 * this.deltaTime);
    }

    activatePlayerCamera(){
        this.beforeLoop= ()=>{
            this.beforeRenderUpdate();
            this.updateCamera()
            // this.isGameOver();
        }
    }

    beforeRenderUpdate(){
        this.updateFromControl()
        this.updateGroundDetection()
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
        this.camera.lockedTarget = this._camRoot.position;
        this.camera.fov = 0.47350045992678597;
        this.camera.parent = yTilt;

        this.scene.activeCamera = this.camera;
        return this.camera;
    }

    updateCamera(){
         let centerPlayer = this.mesh.position.y + 2;
         this._camRoot.position = Vector3.Lerp(this._camRoot.position, new Vector3(this.mesh.position.x, centerPlayer, this.mesh.position.z), 0.4);
    }

    // isGameOver(){
    //     if(this.grounded){
    //      console.log("gameover")
    //     }
    // }
}

export default PlayerController;
