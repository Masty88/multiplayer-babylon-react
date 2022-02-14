import React from "react";
import {
    FreeCamera,
    Vector3,
    HemisphericLight,
    MeshBuilder,
    Scene,
    Color4,
    ArcRotateCamera,
    Mesh, Matrix, Color3, StandardMaterial, Quaternion
} from "@babylonjs/core";
import {AdvancedDynamicTexture, Button, Control} from "@babylonjs/gui";
import SceneComponent from "./SceneComponent";
import {useDispatch, useSelector} from "react-redux";
import {changeState} from "../redux/gameState";
import GameController from "../game controller/GameController"; // uses above component in same directory

const GameOverScene= () => {
    const dispatch= useDispatch();

    const onSceneReady = async (scene,engine) => {
        console.log("game over")
    };


    return (
        <div>
            <SceneComponent antialias onSceneReady={onSceneReady} id="my-canvas"/>
        </div>
    )

};

export default GameOverScene;
