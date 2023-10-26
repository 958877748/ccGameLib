// import Prefabs from "./Prefabs"
import ViewManager from "./ViewManager"

const { ccclass, property } = cc._decorator

@ccclass
export default class View extends cc.Component {
    // res: string
    // zIndex: number
    // vnode: cc.Node
    manager: ViewManager
    onLoad() {
        // let res = this.res,
        //     nodes = view.nodes,
        //     node = nodes[res]
        // if (!node) {
        //     let prefab = cc.Canvas.instance.getComponent(Prefabs).get(res)
        //     node = cc.instantiate(prefab)
        //     node.parent = this.node
        //     nodes[res] = node
        // } else {
        //     node.parent = this.node
        // }
        // if (this.zIndex) {
        //     node.zIndex = this.zIndex
        // }
        // node.on('onclick', this.onclick, this)
        // this.vnode = node
    }
    onclick(e: cc.Event.EventTouch) {
    }
    // onDestroy() {
    //     let node = view.nodes[this.res]
    //     node.off('onclick', this.onclick, this)
    //     node.parent = null
    // }
    // find(name: string) {
    //     return cc.find(name, this.vnode)
    // }
}
