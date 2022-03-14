import GameObject from "./GameObject";
import {MeshBuilder, Scene, SceneLoader, Vector3} from "@babylonjs/core";
import "@babylonjs/loaders/glTF";

class EnvironmentController extends GameObject{
    constructor() {
        super();
    }
    async load(){
        // let ground = MeshBuilder.CreateBox("ground", {size:44}, this.scene)
        // ground.scaling = new Vector3(1,.01,1);
        // ground.receiveShadows= true;
        const assets = await this.loadAsset();
        assets.allMeshes.forEach(mesh=>{
            mesh.receiveShadows = true;
            mesh.checkCollisions = true;
        })

    }

    async loadAsset(){
        const result= await SceneLoader.ImportMeshAsync(null,"/assets/", "start_city.glb", this.scene)
        let env = result.meshes[0];
        let allMeshes = env.getChildMeshes();

        return{
            env,
            allMeshes
        }
    }
}

export default EnvironmentController;
