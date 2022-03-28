import GameObject from "./GameObject";
import {
    AdvancedDynamicTexture,
    Button,
    Control,
    Ellipse,
    Rectangle,
    TextBlock,
    Image,
    Container,
    StackPanel
} from "@babylonjs/gui";
import {Color3} from "@babylonjs/core";


class UiController extends GameObject{
    constructor(dispatch,logout,socket,changeScene, value, resetProfile,profile) {
        super();
        const playerUI = AdvancedDynamicTexture.CreateFullscreenUI("UI");
        this.playerUI = playerUI;
        this.dispatch= dispatch;
        this.logout=logout;
        this.resetProfile= resetProfile;
        this.socket= socket;
        this.changeScene= changeScene;
        this.value= value
        this.profile= profile;

        this.containerTop= new Rectangle();
        this.containerTop.width= "100%"
        this.containerTop.height= "64px";
        this.containerTop.color= "transparent"
        playerUI.addControl(this.containerTop)
        this.containerTop.verticalAlignment= Control.VERTICAL_ALIGNMENT_TOP;

        this.containerBottom= new Rectangle();
        this.containerBottom.width= "100%"
        this.containerBottom.height= "64px";
        this.containerBottom.color= "transparent"
        playerUI.addControl(this.containerBottom)
        console.log(this.profile.tutorial)
        this.containerBottom.verticalAlignment= Control.VERTICAL_ALIGNMENT_BOTTOM;

        this.instructionButton=this.createButton("inst","Instruction","0","0");
        this.instructionButton.width="90px";
        this.containerBottom.addControl(this.instructionButton);
        this.instructionButton.onPointerDownObservable.add(() => {
            this.containerFull.notRenderable=false;
        });

        //Instruction
       // if(this.profile.tutorial || this.showInstruction){
            this.containerFull= new Rectangle();
            this.containerFull.width= "100%"
            this.containerFull.height= "100%";
            this.containerFull.background= "rgba(0,0,0,0.9)"
            if(!this.profile.tutorial){
                this.containerFull.notRenderable=true;
            }
            playerUI.addControl(this.containerFull);

            //Arrow instruction
            this.arrowInstruction= this.createInstruction("arrow_inst", "instruction/arrow_instruction.png","Use arrow to move")
            this.arrowInstruction.horizontalAlignment= Control.HORIZONTAL_ALIGNMENT_RIGHT;
            this.arrowInstruction.left="-10%"
            this.containerFull.addControl(this.arrowInstruction);


            //Jump instruction
            this.jumpInstruction= this.createInstruction("arrow_inst", "instruction/spacebar_instruction.png","Use the spacebar to jump")
            this.jumpInstruction.horizontalAlignment= Control.HORIZONTAL_ALIGNMENT_CENTER;
            this.containerFull.addControl(this.jumpInstruction)

            //Mouse instruction
            this.mouseInstruction= this.createInstruction("arrow_inst", "instruction/mouse_instruction.png","Use the mouse to move the camera")
            this.mouseInstruction.horizontalAlignment= Control.HORIZONTAL_ALIGNMENT_LEFT;
            this.mouseInstruction.left="10%";
            this.containerFull.addControl(this.mouseInstruction)

            //Close Button
            this.closeButton=this.createButton("close","I got it", "-60px")
            this.containerFull.addControl(this.closeButton);
            this.closeButton.horizontalAlignment= Control.HORIZONTAL_ALIGNMENT_RIGHT;
            this.closeButton.verticalAlignment= Control.VERTICAL_ALIGNMENT_BOTTOM;
            this.closeButton.width= "200px";
            this.closeButton.background= "green";
            this.closeButton.top="-10%"
            this.closeButton.onPointerDownObservable.add(() => {
                this.containerFull.notRenderable=true;
            });
       // }

        //Avatar
        this.avatar=this.createAvatar("test","30px")
        this.containerTop.addControl(this.avatar);
        this.avatar.horizontalAlignment= Control.HORIZONTAL_ALIGNMENT_LEFT;

        //DropDown
        this.menu=this.createMenu();
        this.menu.verticalAlignment= Control.VERTICAL_ALIGNMENT_BOTTOM
        this.menu.horizontalAlignment= Control.HORIZONTAL_ALIGNMENT_LEFT


        //Logout Button
        this.logoutButton=this.createButton("logout","Logout", "-50px")
        this.containerTop.addControl(this.logoutButton);
        this.logoutButton.horizontalAlignment= Control.HORIZONTAL_ALIGNMENT_RIGHT;
        this.logoutButton.onPointerEnterObservable.add(()=> {
            this.logoutButton.background="Red"
        });
        this.logoutButton.onPointerOutObservable.add(()=> {
            this.logoutButton.background="Black"
        });
         this.logoutButton.onPointerDownObservable.add(() => {
            socket.emit("logout", this.value);
           this.dispatch(this.logout);
           this.dispatch(this.resetProfile)
        });


    }

    createButton(name,text,left,top){
        this.result= new Button(name);
        this.result.width = "60px";
        this.result.height = "40px";
        this.result.color = "white";
        this.result.background = "black";
        this.result.thickness= 0;
        this.result.cornerRadius= 5;
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

    createInstruction(name,path,text){
        this.result= new Rectangle();
        this.result.width = "250px";
        this.result.height = "250px";
        this.result.color = "white";
        this.result.thickness= 0;
        this.result.cornerRadius= 5;

        //Adding image
        this.arrowImage= new Image(name,path)
        this.arrowImage.width="200px"
        this.arrowImage.stretch= Image.STRETCH_UNIFORM;
        //Adding Text
        this.textBlock= new TextBlock("arrow_text", text);
        this.textBlock.resizeToFit= true;
        this.textBlock.fontSize="20px";
        this.textBlock.paddingBottom="20px";
        this.textBlock.color= "white";
        this.textBlock.textWrapping=true
        this.textBlock.horizontalAlignment= Control.HORIZONTAL_ALIGNMENT_CENTER;
        this.textBlock.verticalAlignment= Control.VERTICAL_ALIGNMENT_BOTTOM;
        this.result.addControl(this.textBlock)
        this.result.addControl(this.arrowImage)

        return this.result;
    }

    createAvatar(name,left){
        this.result= new Ellipse();
        this.result.width = "40px"
        this.result.height = "40px";
        this.result.color = "Orange";
        this.result.thickness = 0;
        this.result.left= left;

        //Adding image
        this.image= new Image(name,this.profile.avatar)
        this.image.width="100px"
        this.image.stretch= Image.STRETCH_UNIFORM;
        this.image.horizontalAlignment= Control.HORIZONTAL_ALIGNMENT_CENTER
        this.result.addControl(this.image)

        return this.result
    }

    createMenu(){
        this.result= new Dropdown(this.playerUI,"40px", "90px","white", "black", this.changeScene);
        this.result.left="0px";
        this.result.top="15px";
        this.result.addOption(this.value,this.socket,this.dispatch,this.changeScene,0, "DESERT");
        this.result.addOption(this.value,this.socket,this.dispatch,this.changeScene,0, "START_CITY");
        return this.result
    }

}

const Dropdown = (function () {
    function Dropdown(advancedTexture, height, width, color, background, changeScene) {
        // Members
        this.changeScene= changeScene
        this.height = height;
        this.width = width;
        this.color = color || "black";
        this.background = background || "white";

        this.advancedTexture = advancedTexture;

        // Container
        this.container = new Container();
        this.container.width = this.width;
        this.container.verticalAlignment =Control.VERTICAL_ALIGNMENT_TOP;
        this.container.horizontalAlignment= Control.HORIZONTAL_ALIGNMENT_CENTER
        this.container.isHitTestVisible = false;

        // Primary button
        this.button = Button.CreateSimpleButton(null, "City");
        this.button.height = this.height;
        this.button.cornerRadius= 5;
        this.button.fontSize="12px"
        this.button.background = this.background;
        this.button.color = this.color;
        this.button.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;

        // Options panel
        this.options = new StackPanel();
        this.options.cornerRadius= 5;
        this.options.fontSize="12px"
        this.options.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
         this.options.top = this.height;
        this.options.isVisible = false;
        this.options.isVertical = true;

        const _this = this;
        this.button.onPointerUpObservable.add(function () {
            _this.options.isVisible = !_this.options.isVisible;
        });

        // add controls
        this.advancedTexture.addControl(this.container);
        this.container.addControl(this.button);
        this.container.addControl(this.options);

        // Selection
        this.selected = null;
        this.selectedValue = null;
    }

    Object.defineProperty(Dropdown.prototype, 'top', {
        get: function () {
            return this.container.top;
        },
        set: function (value) {
            this.container.top = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Dropdown.prototype, 'left', {
        get: function () {
            return this.container.left;
        },
        set: function (value) {
            this.container.left = value;
        },
        enumerable: true,
        configurable: true
    });
    Dropdown.prototype.addOption = function (room,socket,dispatch,action,value, text, color, background) {
        const _this = this;
        const button =  Button.CreateSimpleButton(text, text);
        button.height = _this.height;
        button.paddingTop = "-1px";
        button.background = background || _this.background;
        button.color = color || _this.color;
        button.onPointerUpObservable.add(function () {
            _this.options.isVisible = false;
            _this.button.children[0].text = text;
            _this.selected = button;
            _this.selectedValue = value;
            action.payload=_this.button.children[0].text;
            console.log(action.payload)
            socket.removeAllListeners()
            socket.emit("logout",room);
            //socket.leave(this.value)
            dispatch(action);
        });
        this.options.addControl(button);
    };
    return Dropdown;
}());

export default UiController;
