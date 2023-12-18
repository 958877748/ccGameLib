import View from "./View"

const { ccclass, property, requireComponent } = cc._decorator

@ccclass
@requireComponent(cc.Widget)
export default class ViewManager extends cc.Component {

    @property({
        type: cc.Prefab,
        displayName: '第一个显示的界面'
    })
    private prefab: cc.Prefab = null

    private array: View[] = []

    protected start(): void {
        this.add(this.prefab)
    }

    add(prefab: cc.Prefab, set?: (node: cc.Node) => void) {
        let node = cc.instantiate(prefab)
        if (set) set(node)
        this.node.addChild(node)
    }

    remove(view: View) {
        let index = this.array.indexOf(view)
        if (index === -1) {
            throw new Error('View not found')
        }
        this.array.splice(index, 1)
        view.node.active = false
    }

    protected resetInEditor(): void {
        let widget = this.getComponent(cc.Widget)
        widget.isAlignTop = true
        widget.isAlignBottom = true
        widget.isAlignLeft = true
        widget.isAlignRight = true
        widget.top = 0
        widget.bottom = 0
        widget.left = 0
        widget.right = 0
    }
}
