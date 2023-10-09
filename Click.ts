const { ccclass, property, menu } = cc._decorator

@ccclass
@menu('view/click')
export default class Click extends cc.Component {

    @property(cc.Node)
    view: cc.Node = null

    @property(cc.AudioClip)
    audio: cc.AudioClip = null

    start() {
        this.node.on('click', this.onclick, this)
    }

    onclick() {
        this.view.emit('onclick', this.node.name)
        if (this.audio) {
            cc.audioEngine.playEffect(this.audio, false)
        }
    }

    resetInEditor(){
        let button = this.getComponent(cc.Button)
        if(!button){
            this.addComponent(cc.Button)
        }
    }
}
