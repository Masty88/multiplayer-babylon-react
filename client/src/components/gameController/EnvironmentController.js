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
    constructor() {
        super();
    }
    async load(){
        // let ground = MeshBuilder.CreateBox("ground", {size:44}, this.scene)
        // ground.scaling = new Vector3(1,.01,1);
        // ground.receiveShadows= true;
        // Skybox
        const skybox = MeshBuilder.CreateBox("skyBox", {size: 1000.0}, this.scene);
        const skyboxMaterial = new StandardMaterial("skyBox", this.scene);
        skyboxMaterial.backFaceCulling = false;
        // skyboxMaterial.reflectionTexture = new CubeTexture("textures/skybox", this.scene);
        // skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
        skyboxMaterial.diffuseColor = new Color3.Blue();
        skyboxMaterial.specularColor = new Color3(0, 0, 0);
        skybox.material = skyboxMaterial;
        const assets = await this.loadAsset();
        assets.allMeshes.forEach(mesh=>{
            mesh.receiveShadows = true;
            mesh.checkCollisions = true;
        })

    }

    async loadAsset(){
        const result= await SceneLoader.ImportMeshAsync(null,"/assets/", "start_town_blend.glb", this.scene)
        let env = result.meshes[0];
        let allMeshes = env.getChildMeshes();

        return{
            env,
            allMeshes
        }
    }
}

export default EnvironmentController;
