import GameObject from "./GameObject";
import {AdvancedDynamicTexture, Button, Control, Rectangle, TextBlock} from "@babylonjs/gui";
import {Color3} from "@babylonjs/core";


class UiController extends GameObject{
    constructor(dispatch,logout,socket, data) {
        super();
        const playerUI = AdvancedDynamicTexture.CreateFullscreenUI("UI");
        this.playerUI = playerUI;
        this.dispatch= dispatch;
        this.logout=logout;
        this.socket= socket;
        this.data= data
        // this.loadUi()

        this.containerTop= new Rectangle();
        this.containerTop.width= "100%"
        this.containerTop.height= "64px";
        this.containerTop.color= "transparent"
        this.containerTop.background= "Orange";
        playerUI.addControl(this.containerTop)
        this.containerTop.verticalAlignment= Control.VERTICAL_ALIGNMENT_TOP;

        this.avavtar=

        //Logout Button
        this.logoutButton=this.createButton("logout","Logout", "-30px")
        this.containerTop.addControl(this.logoutButton);
        this.logoutButton.horizontalAlignment= Control.HORIZONTAL_ALIGNMENT_RIGHT;
        this.logoutButton.onPointerEnterObservable.add(()=> {
            console.log(this.logoutButton.background)
            this.logoutButton.background="Red"
        });
        this.logoutButton.onPointerOutObservable.add(()=> {
            this.logoutButton.background="Black"
        });
         this.logoutButton.onPointerDownObservable.add(() => {
            socket.emit("logout", data);
            socket.removeAllListeners();
           this.dispatch(this.logout)
        });


    }

    createButton(name,text,left){
        this.result= new Button(name);
        this.result.width = "60px";
        this.result.height = "40px";
        this.result.color = "white";
        this.result.background = "black";
        this.result.thickness= 0;
        this.result.left= left;


        //Adding Text
        this.textBlock= new TextBlock(name +"_button", text)
        this.textBlock.resizeToFit= true;
        this.textBlock.fontSize="15px"
        this.textBlock.paddingLeft="20px";
        this.textBlock.paddingRight="20px";
        this.textBlock.textHorizontalAlignment= Control.HORIZONTAL_ALIGNMENT_CENTER;
        this.result.addControl(this.textBlock);

        return this.result

    }

}

export default UiController;
