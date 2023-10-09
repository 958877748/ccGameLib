import prefabs from "./prefabs"

const { ccclass, property } = cc._decorator

@ccclass
export default class view extends cc.Component {
    static nodes: { [x: string]: cc.Node } = {}
    res: string
    zIndex: number
    vnode: cc.Node
    onLoad() {
        let res = this.res,
            nodes = view.nodes,
            node = nodes[res]
        if (!node) {
            let prefab = cc.Canvas.instance.getComponent(prefabs).get(res)
            node = cc.instantiate(prefab)
            node.parent = this.node
            nodes[res] = node
        } else {
            node.parent = this.node
        }
        if (this.zIndex) {
            node.zIndex = this.zIndex
        }
        node.on('onclick', this.onclick, this)
        this.vnode = node
    }
    onclick(name: string) {
    }
    onDestroy() {
        let node = view.nodes[this.res]
        node.off('onclick', this.onclick, this)
        node.parent = null
    }
    find(name: string) {
        return cc.find(name, this.vnode)
    }
}
