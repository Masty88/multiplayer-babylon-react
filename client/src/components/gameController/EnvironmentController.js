//TODO add glow layer to portal
import GameObject from "./GameObject";
import {
    ActionManager,
    Color3, ExecuteCodeAction,
    MeshBuilder, PBRMetallicRoughnessMaterial,
    SceneLoader, Texture, TransformNode,
    Vector3
} from "@babylonjs/core";
import "@babylonjs/loaders/glTF";
import Lantern from "./Lantern";
import {AdvancedDynamicTexture, Control, TextBlock} from "@babylonjs/gui";


class EnvironmentController extends GameObject{
    constructor(city) {
        super();
        this.city= city;

        this._lanternObjs = [];
        //create emissive material for when lantern is lit
        const lightmtl = new PBRMetallicRoughnessMaterial("lantern mesh light", this.scene);
        lightmtl.emissiveTexture = new Texture("/textures/litLantern.png", this.scene, true, false);
        lightmtl.emissiveColor = new Color3(0.8784313725490196, 0.7568627450980392, 0.6235294117647059);
        this._lightmtl = lightmtl;
    }
    async load(){
        await this.createBonusPortal()

        const assets = await this.loadAsset();
        assets.allMeshes.forEach(mesh=>{
            mesh.receiveShadows = true;
            mesh.checkCollisions = true;
            if (mesh.name == "ground") {
                //dont check for collisions, dont allow for raycasting to detect it(cant land on it)
                mesh.checkCollisions = false;
                mesh.isPickable = false;
            }
              //areas that will use box collisions
            if (mesh.name.includes("stairs") || mesh.name == "cityentranceground" || mesh.name == "fishingground.001" || mesh.name.includes("lilyflwr")) {
                mesh.checkCollisions = false;
                mesh.isPickable = false;
            }
              //collision meshes
            if (mesh.name.includes("collision")) {
                mesh.isVisible = false;
                mesh.isPickable = true;
            }
             //trigger meshes
            if (mesh.name.includes("Trigger")) {
                mesh.isVisible = false;
                mesh.isPickable = false;
                mesh.checkCollisions = false;
            }
        })

        //Hide limit of the world
        this.scene.getMeshByID("limit").isVisible=false;
        this.scene.getMeshByID("limit.2").isVisible=false;
        this.scene.getMeshByID("limit.3").isVisible=false;
        this.scene.getMeshByID("limit.4").isVisible=false;

        //LANTERNS
        if(this.city==="bonus_game.glb"){
            assets.lantern.isVisible = false; //original mesh is not visible
            //transform node to hold all lanterns
            const lanternHolder = new TransformNode("lanternHolder", this.scene);
            for (let i = 0; i < 22; i++) {
                //Mesh Cloning
                let lanternInstance = assets.lantern.clone("lantern" + i); //bring in imported lantern mesh & make clones
                lanternInstance.isVisible = true;
                lanternInstance.setParent(lanternHolder);

                //Create the new lantern object
                let newLantern = new Lantern(lanternInstance, assets.env.getChildTransformNodes(false).find(m => m.name === "lantern " + i).getAbsolutePosition(),this._lightmtl);
                this._lanternObjs.push(newLantern);
            }
            //dispose of original mesh and animation group that were cloned
            assets.lantern.dispose();
        }

    }

    async loadAsset(){
        if(this.city==="bonus_game.glb"){
            const result= await SceneLoader.ImportMeshAsync(null,"/assets/", this.city, this.scene)
            let env = result.meshes[0];
            let allMeshes = env.getChildMeshes();
            //loads lantern mesh
            const res = await SceneLoader.ImportMeshAsync("", "./assets/", "lantern.glb", this._scene);
            //extract the actual lantern mesh from the root of the mesh that's imported, dispose of the root
            let lantern = res.meshes[0].getChildren()[0];
            lantern.parent = null;
            res.meshes[0].dispose();
            return{
                env,
                allMeshes,
                lantern
            }
        }else{
            const result= await SceneLoader.ImportMeshAsync(null,"/assets/", this.city, this.scene)
            let env = result.meshes[0];
            let allMeshes = env.getChildMeshes();
            return{
                env,
                allMeshes,
            }
        }

    }

    async createBonusPortal(){
        if(this.city=="start_town_blend.glb"){
            let portal=MeshBuilder.CreateBox("portal", {width:5, height:10, depth:3}, this.scene);
            portal.position= new Vector3(-5,0,-45);
            portal.isVisible= false;
            const result= await SceneLoader.ImportMeshAsync(null,"/assets/", "portal.glb", this.scene)
            result.meshes[0].parent= portal
            return{
                portal,
                result,
            }
        }
    }

    checkLanterns(player){
        player.lanternsLit=0;

        this._lanternObjs.forEach(lantern => {
            player.mesh.actionManager.registerAction(
                new ExecuteCodeAction(
                    {
                        trigger: ActionManager.OnIntersectionEnterTrigger,
                        parameter: lantern.mesh
                    },
                    () => {
                        //if the lantern is not lit, light it up & reset sparkler timer
                        if (!lantern.isLit) {
                            player.lanternsLit += 1; //increment the lantern count
                            lantern.setEmissiveTexture(); //"light up" the lantern
                            //reset the sparkler
                            player.sparkReset = true;
                            player.sparkLit = true;
                        }
                        //if the lantern is lit already, reset the sparkler
                        else if (lantern.isLit) {
                            player.sparkReset = true;
                            player.sparkLit = true;
                        }
                    }
                )
            );
        });
    }
}

export default EnvironmentController;
