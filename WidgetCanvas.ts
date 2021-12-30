const { ccclass, property, menu, requireComponent } = cc._decorator

/**
 * 在运行时将 Widget 组件的 target 设置为 Canvas 节点
 */
@ccclass
@menu('View/WidgetCanvas')
@requireComponent(cc.Widget)
export default class WidgetCanvas extends cc.Component {

    @property(cc.Widget)
    Widget: cc.Widget = null

    resetInEditor() {
        this.Widget = this.getComponent(cc.Widget)
    }

    start() {
        this.Widget.target = cc.Canvas.instance.node
    }
}
