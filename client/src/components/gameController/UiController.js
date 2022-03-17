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
        playerUI.addControl(this.containerTop)
        this.containerTop.verticalAlignment= Control.VERTICAL_ALIGNMENT_TOP;

        this.containerBottom= new Rectangle();
        this.containerBottom.width= "100%"
        this.containerBottom.height= "64px";
        this.containerBottom.color= "transparent"
        playerUI.addControl(this.containerBottom)
        this.containerBottom.verticalAlignment= Control.VERTICAL_ALIGNMENT_BOTTOM;

        this.avatar=this.createAvatar("test","30px")
        this.containerTop.addControl(this.avatar);
        this.avatar.horizontalAlignment= Control.HORIZONTAL_ALIGNMENT_LEFT;

        this.menu=this.createMenu();
        this.menu.verticalAlignment= Control.VERTICAL_ALIGNMENT_BOTTOM
        this.menu.horizontalAlignment= Control.HORIZONTAL_ALIGNMENT_LEFT
        // this.containerBottom.addControl(this.menu);

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

    createAvatar(name,left){
        this.result= new Ellipse();
        this.result.width = "40px"
        this.result.height = "40px";
        this.result.color = "Orange";
        this.result.thickness = 0;
        this.result.left= left;

        //Adding image
        this.image= new Image(name,"/avatar/girl.png")
        this.image.width="100px"
        this.image.stretch= Image.STRETCH_UNIFORM;
        this.image.horizontalAlignment= Control.HORIZONTAL_ALIGNMENT_CENTER
        this.result.addControl(this.image)

        return this.result
    }

    createMenu(){
        this.result= new Dropdown(this.playerUI,"40px", "60px","white", "black");
        this.result.left="0px";
        this.result.top="15px";
        this.result.addOption(0, "Option E");
        this.result.addOption(1, "Option F");
        this.result.addOption(2, "Option G");
        return this.result
    }

}

const Dropdown = (function () {
    function Dropdown(advancedTexture, height, width, color, background) {
        // Members
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
        this.button.fontSize="15px"
        this.button.background = this.background;
        this.button.color = this.color;
        this.button.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;

        // Options panel
        this.options = new StackPanel();
        this.options.cornerRadius= 5;
        this.options.fontSize="15px"
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
    Dropdown.prototype.addOption = function (value, text, color, background) {
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
            console.log("here")
        });
        this.options.addControl(button);
    };
    return Dropdown;
}());

export default UiController;
