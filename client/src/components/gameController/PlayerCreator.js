import GameObject from "./GameObject";
import {
    ArcRotateCamera, Color3,
    Color4,
    FreeCamera,
    Matrix, Mesh,
    MeshBuilder,
    Quaternion, Ray, SceneLoader,
    StandardMaterial, TransformNode, UniversalCamera,
    Vector3
} from "@babylonjs/core";
import "@babylonjs/loaders/glTF";

class PlayerCreator extends GameObject{
    constructor(shadowGenerator, engine) {
        super();
        this.loadCharacterAssets(shadowGenerator)
        this.engine= engine
    }

    loadCharacterAssets(){
        this.mesh = MeshBuilder.CreateBox("outer", {width: 2, depth: 1, height: 3});
        // const bodymtl = new StandardMaterial("red", this.scene);
        // bodymtl.diffuseColor = new Color3.Red();
        // this.mesh.material = bodymtl;
        this.mesh.isVisible = false;
        this.mesh.isPickable = false;
        this.mesh.checkCollisions = true;

        //move origin of box collider to the bottom of the mesh (to match player mesh)
        this.mesh.bakeTransformIntoVertices(Matrix.Translation(0, 1.5, 0))

        //for collisions
        this.mesh.ellipsoid = new Vector3(1, 1.5, 1);
        this.mesh.ellipsoidOffset = new Vector3(0, 1.5, 0);

        this.mesh.rotationQuaternion = new Quaternion(0, 1, 0, 0); // rotate the player mesh 180 since we want to see the back of the player
        this.mesh.position.y= 0.2;

        // const box = MeshBuilder.CreateBox("Small1", {
        //     width: 0.5,
        //     depth: 0.5,
        //     height: 0.25,
        //     faceColors: [new Color4(0, 0, 0, 1), new Color4(0, 0, 0, 1), new Color4(0, 0, 0, 1), new Color4(0, 0, 0, 1), new Color4(0, 0, 0, 1), new Color4(0, 0, 0, 1)]
        // });
        // box.position.y = 0.5;
        // box.position.z = 1;
        //
        // const body = Mesh.CreateCylinder("body", 3, 2, 2, 0, 0);
        // const bodymtl = new StandardMaterial("red", this.scene);
        // bodymtl.diffuseColor = new Color3.Red();
        // body.material = bodymtl;
        // body.isPickable = false;
        // body.bakeTransformIntoVertices(Matrix.Translation(0, 1.5, 0)); // simulates the imported mesh's origin
        //
        // //parent the meshes
        // box.parent = body;
        // body.parent = this.mesh;
        // shadowGenerator.addShadowCaster(this.mesh); //the player mesh will cast shadows
    }

    async loadMesh(shadowGenerator){
        await SceneLoader.ImportMeshAsync(null,"/assets/","girl.glb", this.scene).then((result)=>{
            const root = result.meshes[0];
            // console.log(root.getChildren())
            //body is our actual player mesh
            const body = root;
            body.parent = this.mesh;
            body.isPickable = false; //so our raycasts dont hit ourself
            body.getChildMeshes().forEach(m => {
                m.isPickable = false;
            })
           //  this.mesh.idle= this.scene.getAnimationGroupByName("idle");
           // // console.log("idle",this.mesh.idle.uniqueId)
           //  this.mesh.idle.uniqueId= "123"
           //  this.mesh.landing= this.scene.getAnimationGroupByName("landing");
           //  this.mesh.walking= this.scene.getAnimationGroupByName("walking");
           //  this.mesh.walking.uniqueId= "456"
           //  console.log("walking",this.mesh.walking.uniqueId)
            shadowGenerator.addShadowCaster(this.mesh); //the player mesh will cast shadows
            this.playerFinishedLoad=true
            if(this.playerFinishedLoad){
                this.engine.hideLoadingUI();
            }
        })
    }

}

export default PlayerCreator
