import View from "./View"

const { ccclass, property } = cc._decorator

@ccclass
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

    add(prefab: cc.Prefab) {
        let node = cc.instantiate(prefab)
        let view = node.getComponent(View)
        view.manager = this
        this.array.push(view)
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
}
