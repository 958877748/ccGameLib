// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class bgMusic extends cc.Component {

    @property(cc.AudioClip)
    music: cc.AudioClip = null

    onEnable() {
        cc.audioEngine.playMusic(this.music, true)
    }
}
