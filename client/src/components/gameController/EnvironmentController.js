import GameObject from "./GameObject";
import {
    Color3,
    CubeTexture,
    MeshBuilder,
    Scene,
    SceneLoader,
    StandardMaterial,
    Texture,
    Vector3
} from "@babylonjs/core";
import "@babylonjs/loaders/glTF";
import {blue} from "@mui/material/colors";

class EnvironmentController extends GameObject{
    constructor(city) {
        super();
        this.city= city;
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
        const result= await SceneLoader.ImportMeshAsync(null,"/assets/", this.city, this.scene)
        let env = result.meshes[0];
        let allMeshes = env.getChildMeshes();

        return{
            env,
            allMeshes
        }
    }
}

export default EnvironmentController;
