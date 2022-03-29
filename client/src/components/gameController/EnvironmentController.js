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
        this.createBonusPortail()

        const assets = await this.loadAsset();
        assets.allMeshes.forEach(mesh=>{
            mesh.receiveShadows = true;
            mesh.checkCollisions = true;
        })

        //Hide limit of the world
        /*
        this.scene.getMeshByID("limit").isVisible=false;
        this.scene.getMeshByID("limit.2").isVisible=false;
        this.scene.getMeshByID("limit.3").isVisible=false;
        this.scene.getMeshByID("limit.4").isVisible=false;

         */
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
    createBonusPortail(){
        if(this.city=="start_town_blend.glb"){
            console.log("city",this.city)
            let portail=MeshBuilder.CreateBox("portail", {size:5}, this.scene);
            portail.position= new Vector3(0,0,-15);
            // portail.checkCollisions= true;
        }
    }
}

export default EnvironmentController;
