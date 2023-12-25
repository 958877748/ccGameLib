const { ccclass, property } = cc._decorator

@ccclass
export default class AnimationEndDestory extends cc.Component {
    start() {
        let Animation = this.getComponent(cc.Animation)
        Animation.once(cc.Animation.EventType.FINISHED, this.onFinished, this)
    }
    onFinished() {
        this.node.destroy()
    }
}
