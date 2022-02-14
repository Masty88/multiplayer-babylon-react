import GameObject from "./GameObject";
import {MeshBuilder, Vector3} from "@babylonjs/core";

class EnvironmentController extends GameObject{
    constructor() {
        super();
    }
    async load(){
        let ground = MeshBuilder.CreateBox("ground", {size:44})
        ground.scaling = new Vector3(1,.02,1);
        ground.receiveShadows= true;
    }
}

export default EnvironmentController;
