import GameObject from "./GameObject";
import {
    ArcRotateCamera, Color3,
    Color4,
    FreeCamera,
    Matrix, Mesh,
    MeshBuilder,
    Quaternion, Ray, SceneLoader, ShadowGenerator,
    StandardMaterial, TransformNode, UniversalCamera,
    Vector3
} from "@babylonjs/core";
import "@babylonjs/loaders/glTF";

class PlayerCreator extends GameObject{
    constructor(engine) {
        super();
        this.engine= engine;
        // this.profile=profile;
        this.loadCharacterAssets()
    }

    loadCharacterAssets(){
        this.mesh = MeshBuilder.CreateBox("outer", {width: 1.5, depth: 1.5, height: 3});
        this.mesh.isVisible = false;
        this.mesh.isPickable = false;
        this.mesh.checkCollisions = true;

        //move origin of box collider to the bottom of the mesh (to match player mesh)
        this.mesh.bakeTransformIntoVertices(Matrix.Translation(0, 1.5, 0))
        //for collisions
        this.mesh.ellipsoid = new Vector3(1, 1.5, 1);
        this.mesh.ellipsoidOffset = new Vector3(0, 1.5, 0);
        this.mesh.position.y=0;
        this.mesh.position.x=Math.floor(Math.random()*3)
        this.mesh.position.z=Math.floor(Math.random()*5)
        this.mesh.rotationQuaternion = new Quaternion(0, 1, 0, 0); // rotate the player mesh 180 since we want to see the back of the player
    }

     loadMesh(profile){
        return SceneLoader.ImportMeshAsync(null,"/assets/",profile, this.scene).then((result)=>{
            const root = result.meshes[0];
            //body is our actual player mesh
            this.body = root;
            this.body.parent = this.mesh;
            this.body.isPickable = false; //so our raycasts dont hit ourself
            this.body.getChildMeshes().forEach(m => {
                m.isPickable = false;
                m.receiveShadows= true;
            })
            this.mesh.idle= result.animationGroups[0];
            this.mesh.jumping= result.animationGroups[1];
            this.mesh.landing= result.animationGroups[2];
            this.mesh.running= result.animationGroups[3];
            this.mesh.FinishedLoad=true
            if(this.mesh.FinishedLoad){
                this.engine.hideLoadingUI();
                return {
                    mesh: this.mesh ,
                    animationGroups: result.animationGroups
                }
            }
        })
    }
}

export default PlayerCreator
