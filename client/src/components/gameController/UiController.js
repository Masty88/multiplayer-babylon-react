import GameObject from "./GameObject";
import {AdvancedDynamicTexture, Button} from "@babylonjs/gui";


class UiController extends GameObject{
    constructor(dispatch,logout,socket, data) {
        super();
        const playerUI = AdvancedDynamicTexture.CreateFullscreenUI("UI");
        this.playerUI = playerUI;
        this.playerUI.idealHeight = 720;
        this.dispatch= dispatch;
        this.logout=logout;
        this.socket= socket;
        this.data= data

        const logOutBtn = Button.CreateSimpleButton("start", "LOGOUT");
        logOutBtn.width = "48px";
        logOutBtn.color= "white"
        logOutBtn.height = "86px";
        logOutBtn.thickness = 0;
        logOutBtn.verticalAlignment = 0;
        logOutBtn.horizontalAlignment = 1;
        logOutBtn.top = "-16px";
        playerUI.addControl(logOutBtn);
        logOutBtn.zIndex = 10;
        this.logOutBtn = logOutBtn;
        //when the button is down, make pause menu visable and add control to it
        logOutBtn.onPointerDownObservable.add(() => {
            socket.emit("logout", data);
            socket.removeAllListeners();
           this.dispatch(this.logout)
        });

    }

}

export default UiController;
