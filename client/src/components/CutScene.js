import React from "react";
import {FreeCamera, Vector3, HemisphericLight, MeshBuilder, Scene, Color4} from "@babylonjs/core";
import {AdvancedDynamicTexture, Button, Control} from "@babylonjs/gui";
import SceneComponent from "./SceneComponent";
import {useDispatch, useSelector} from "react-redux";
import {changeState} from "../redux/gameState";
import gameScene from "./GameScene";
import GameController from "../game controller/GameController"; // uses above component in same directory

const CutScene= () => {
    const dispatch= useDispatch();

    const onSceneReady = async (scene,engine) => {
        engine.displayLoadingUI();
        let camera = new FreeCamera("camera1", new Vector3(0, 0, 0), scene);
        camera.setTarget(Vector3.Zero());

        const guiMenu = AdvancedDynamicTexture.CreateFullscreenUI("UI");
        guiMenu.idealHeight = 720; //fit our fullscreen ui to this height

        //create a simple button
        const nextBtn = Button.CreateSimpleButton("next", "Next");
        nextBtn.width = 0.2;
        nextBtn.height = "40px";
        nextBtn.color = "white";
        nextBtn.top = "-14px";
        nextBtn.thickness = 0;
        nextBtn.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        guiMenu.addControl(nextBtn);

        //this handles interactions with the start button attached to the scene
        nextBtn.onPointerDownObservable.add(() => {
            dispatch(changeState());
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

export default CutScene;
