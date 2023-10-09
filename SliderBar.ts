import { gamedata } from "./IGameData"
import SwitchText from "./SwitchText"

const { ccclass, property } = cc._decorator

@ccclass
export default class SliderBar extends cc.Component {

    @property(SwitchText)
    text: SwitchText = null

    @property
    offx = 0

    @property
    onx = 0

    @property
    par = ''

    onEnable() {
        let node = this.node
        node.on(cc.Node.EventType.TOUCH_MOVE, this.ontouchmove, this)
        node.on(cc.Node.EventType.TOUCH_END, this.ontouchend, this)
        node.on(cc.Node.EventType.TOUCH_CANCEL, this.ontouchend, this)

        let ison = gamedata[this.par]
        if (ison) {
            node.x = this.onx
            this.text.index = 1
        } else {
            node.x = this.offx
            this.text.index = 0
        }
    }
    onDisable() {
        let node = this.node
        node.off(cc.Node.EventType.TOUCH_MOVE, this.ontouchmove, this)
        node.off(cc.Node.EventType.TOUCH_END, this.ontouchend, this)
        node.off(cc.Node.EventType.TOUCH_CANCEL, this.ontouchend, this)
    }
    ontouchmove(e: cc.Event.EventTouch) {
        let v2 = e.getDelta()
        this.node.x += v2.x
        if (this.node.x > this.onx) {
            this.node.x = this.onx
        } else if (this.node.x < this.offx) {
            this.node.x = this.offx
        }
        if (this.node.x > 0) {
            this.text.index = 1
        } else {
            this.text.index = 0
        }
    }
    ontouchend(e: cc.Event.EventTouch) {
        if (this.node.x > 0) {
            this.node.x = this.onx
            gamedata[this.par] = true
        } else {
            this.node.x = this.offx
            gamedata[this.par] = false
        }
    }
}
