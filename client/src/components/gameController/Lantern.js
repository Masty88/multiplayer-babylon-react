import GameObject from "./GameObject";
import {Color3, Mesh, PointLight, Vector3} from "@babylonjs/core";

class Lantern extends GameObject{
    constructor(mesh,position,lightmtl) {
        super();
        this._lightmtl = lightmtl;
        //create the lantern's sphere of illumination
        const lightSphere = Mesh.CreateSphere("illum", 4, 20, this._scene);
        lightSphere.scaling.y = 2;
        lightSphere.setAbsolutePosition(position);
        lightSphere.parent = this.mesh;
        lightSphere.isVisible = false;
        lightSphere.isPickable = false;
        this._lightSphere = lightSphere;

        //load the lantern mesh
        this.loadLantern(mesh, position);
    }

    loadLantern(mesh,position) {
        this.mesh = mesh;
        this.mesh.scaling = new Vector3(.8, .8, .8);
        this.mesh.setAbsolutePosition(position);
        this.mesh.isPickable = false;
    }

    setEmissiveTexture(){
        this.isLit = true;

        //swap texture
        this.mesh.material = this._lightmtl;

        //create light source for the lanterns
        const light = new PointLight("lantern light", this.mesh.getAbsolutePosition(), this._scene);
        light.intensity = 30;
        light.radius = 2;
        light.diffuse = new Color3(0.45, 0.56, 0.80);
        this.findNearestMeshes(light);
    }

    findNearestMeshes(light) {
        this.scene.getMeshByName("__root__").getChildMeshes().forEach(m => {
            if (this._lightSphere.intersectsMesh(m)) {
                light.includedOnlyMeshes.push(m);
            }
        });

        //get rid of the sphere
        this._lightSphere.dispose();
    }
}

export default Lantern;
