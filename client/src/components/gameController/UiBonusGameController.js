import GameObject from "./GameObject";
import {AdvancedDynamicTexture, Button, Control, Image, Rectangle, StackPanel, TextBlock} from "@babylonjs/gui";
import UiController from "./UiController";

class UiBonusGameController extends GameObject{
    constructor(dispatch,action) {
        super();
        this.dispatch=dispatch;
        this.action=action;
        const playerUI = AdvancedDynamicTexture.CreateFullscreenUI("UI");
        this.playerUI = playerUI;

        //Lantern Count
        const lanternCnt = new TextBlock();
        lanternCnt.name = "lantern count";
        lanternCnt.textVerticalAlignment = TextBlock.VERTICAL_ALIGNMENT_CENTER;
        lanternCnt.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
        lanternCnt.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        lanternCnt.fontSize = "22px";
        lanternCnt.color = "white";
        lanternCnt.text = "Lanterns: 1 / 22";
        lanternCnt.top = "80px";
        lanternCnt.left = "-64px";
        lanternCnt.width = "25%";
        lanternCnt.resizeToFit = true;
        playerUI.addControl(lanternCnt);
        this.lanternCnt = lanternCnt;


        //Game timer text
        const clockTime = new TextBlock();
        clockTime.name = "clock";
        clockTime.textHorizontalAlignment = TextBlock.HORIZONTAL_ALIGNMENT_CENTER;
        clockTime.zIndex=-1;
        clockTime.verticalAlignment= Control.VERTICAL_ALIGNMENT_TOP;
        clockTime.verticalAlignment= Control.VERTICAL_ALIGNMENT_TOP;
        clockTime.fontSize = "48px";
        clockTime.color = "white";
        clockTime.text = "00:00";
        clockTime.resizeToFit = true;
        clockTime.top="72px";
        clockTime.height = "96px";
        clockTime.width = "220px";
        playerUI.addControl(clockTime);
        this.clockTime = clockTime;


        //Instruction
        this.containerFull= new Rectangle();
        this.containerFull.width= "100%"
        this.containerFull.height= "100%";
        this.containerFull.background= "rgba(0,0,0,0.9)"
        playerUI.addControl(this.containerFull);

        //GameBonusInstruction
        this.gameInstruction= this.createInstruction("game_inst", "","You have 4 minutes to light on all the 22 lanterns, if you fall you will come back to the start you can play this game every 24h")
        this.gameInstruction.horizontalAlignment=Control.HORIZONTAL_ALIGNMENT_CENTER;
        this.gameInstruction.verticalAlignment=Control.VERTICAL_ALIGNMENT_CENTER;
        this.containerFull.addControl(this.gameInstruction)

        //Close Button
        this.closeButton=this.createButton("close","Let Play", "-60px")
        this.containerFull.addControl(this.closeButton);
        this.closeButton.horizontalAlignment= Control.HORIZONTAL_ALIGNMENT_RIGHT;
        this.closeButton.verticalAlignment= Control.VERTICAL_ALIGNMENT_BOTTOM;
        this.closeButton.width= "200px";
        this.closeButton.background= "green";
        this.closeButton.top="-10%"
        this.closeButton.onPointerDownObservable.add(() => {
            this.containerFull.notRenderable=true;
            this.startTimer()
        });
        if(this.time >=240){
            this.gameInstruction.isVisible=false;
            this.closeButton.isVisible=false;
        }

        this.prevTime = 0;
        this._sString="00";
        this._mString="00";
        this.action.payload= "START_CITY"

    }

    //TODO remove duplicated code

    createInstruction(name,path,text){
        this.result= new Rectangle();
        this.result.width = "450px";
        this.result.height = "250px";
        this.result.color = "white";
        this.result.thickness= 0;
        this.result.cornerRadius= 5;

        //Adding Text
        this.textBlock= new TextBlock("arrow_text", text);
        this.textBlock.resizeToFit= true;
        this.textBlock.fontSize="20px";
        this.textBlock.color= "white";
        this.textBlock.textWrapping=true
        this.textBlock.horizontalAlignment= Control.HORIZONTAL_ALIGNMENT_CENTER;
        this.textBlock.verticalAlignment= Control.VERTICAL_ALIGNMENT_CENTER;
        this.result.addControl(this.textBlock)

        if(this.time>10){
            console.log("ok")
        }

        return this.result;
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

    updateUI() {
        if (!this.stopTimer && this.startTime != null) {
            let curTime = Math.floor((new Date().getTime() - this.startTime) / 1000) + this.prevTime; // divide by 1000 to get seconds
            this.time = curTime; //keeps track of the total time elapsed in seconds
            this.clockTime.text = this.formatTime(curTime);
            //LOSE CONDITION
            if(this.time>=240){
                //Lose Instruction
                this.loseMessage= this.createInstruction("loose_inst", "","Sorry you fail")
                this.loseMessage.horizontalAlignment=Control.HORIZONTAL_ALIGNMENT_CENTER;
                this.containerFull.addControl(this.loseMessage)
                this.containerFull.removeControl(this.gameInstruction);
                this.containerFull.removeControl(this.closeButton);
                this.containerFull.notRenderable=false;
                setTimeout(()=>{
                    this.dispatch(this.action)
                },2000)
            }
        }
    }

    updateLanternCount(numLanterns) {
            this.lanternCnt.text = "Lanterns: " + numLanterns + " / 22";
        //LOSE CONDITION
        if(numLanterns===22){
            //Win Instruction
            this.winMessage= this.createInstruction("loose_inst", "","Great you win 1000 token")
            this.winMessage.horizontalAlignment=Control.HORIZONTAL_ALIGNMENT_CENTER;
            this.containerFull.addControl(this.winMessage)
            this.containerFull.removeControl(this.gameInstruction);
            this.containerFull.removeControl(this.closeButton);
            this.containerFull.notRenderable=false;
            setTimeout(()=>{
                this.dispatch(this.action)
            },2000)
        }
        }

    startTimer(){
        this.startTime = new Date().getTime();
        this.stopTimer = false;
    }
    formatTime(time){
        let minsPassed = Math.floor(time / 60); //seconds in a min
        console.log("min",minsPassed)
        let secPassed = time; // goes back to 0 after 4mins/240sec
        if(time>=60){
            secPassed= time - 60 *(minsPassed)
        }
        this._mString = Math.floor(minsPassed );
        this._sString = (secPassed < 10  ? "0" : "") + secPassed ;

        return (this._mString + ":" + this._sString );
    }
}

export default UiBonusGameController;
