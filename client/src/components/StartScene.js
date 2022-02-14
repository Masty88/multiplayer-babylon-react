import React from "react";
import {FreeCamera, Vector3, HemisphericLight, MeshBuilder, Scene, Color4} from "@babylonjs/core";
import {AdvancedDynamicTexture, Button, Control} from "@babylonjs/gui";
import SceneComponent from "./SceneComponent";
import {useDispatch, useSelector} from "react-redux";
import {changeState} from "../redux/gameState"; // uses above component in same directory






/**
 * Will run on every frame render.  We are spinning the box on y-axis.
 */

let box;

const StartScene= () => {
     const dispatch= useDispatch();

    const onSceneReady =async  (scene,engine) => {
        engine.displayLoadingUI();
        let camera = new FreeCamera("camera1", new Vector3(0, 0, 0), scene);
        camera.setTarget(Vector3.Zero());


        const guiMenu = AdvancedDynamicTexture.CreateFullscreenUI("UI");
        guiMenu.idealHeight = 720; //fit our fullscreen ui to this height

        //create a simple button
        const startBtn = Button.CreateSimpleButton("start", "PLAY");
        startBtn.width = 0.2;
        startBtn.height = "40px";
        startBtn.color = "white";
        startBtn.top = "-14px";
        startBtn.thickness = 0;
        startBtn.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        guiMenu.addControl(startBtn);

        //this handles interactions with the start button attached to the scene
        startBtn.onPointerDownObservable.add(() => {
            dispatch(changeState());
            console.log("click")
            scene.detachControl(); //observables disabled
        });
        await scene.whenReadyAsync();
        engine.hideLoadingUI();
    };


    return (
        <div>
            <SceneComponent antialias onSceneReady={onSceneReady} id="my-canvas"/>
        </div>
    )

};

export default StartScene;
