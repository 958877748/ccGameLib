// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import VirtualList from "./VirtualList"

const { ccclass, menu } = cc._decorator

@ccclass
@menu('List/VirtualItem')
export default class VirtualItem<T> extends cc.Component {

    /**
     * 所属列表
     */
    virtualList: VirtualList<T> = null

    /**
     * 下标
     */
    index: number = null

    /**
     * 数据
     */
    data: T = null

    /**
     * 真实节点是否激活
     */
    nodeActive: boolean = false

    /**
     * 检查是否在可是区域内
     */
    checkOut: Function = null

    /**
     * 初始化
     * @param virtualList 
     * @param index 
     * @param data 
     */
    init(virtualList: VirtualList<T>, index: number, data: T) {
        this.virtualList = virtualList
        this.index = index
        this.data = data
        //水平滚动还是垂直滚动
        if (this.virtualList.ScrollView.vertical) {
            //垂直滚动
            this.checkOut = this.checkOutY
        } else {
            this.checkOut = this.checkOutX
        }
    }

    onEnable() {
        //监听变化

        //内容区会滚动
        this.virtualList.content.on(cc.Node.EventType.POSITION_CHANGED, this.checkOut, this)

        //layout 会改变我的坐标
        this.node.on(cc.Node.EventType.POSITION_CHANGED, this.checkOut, this)
    }

    onDisable() {
        this.virtualList.content.off(cc.Node.EventType.POSITION_CHANGED, this.checkOut, this)
        this.node.off(cc.Node.EventType.POSITION_CHANGED, this.checkOut, this)
        // let node = this.node.children[0]
        // if (node)
        //     this.virtualList.returnNode(node)
    }

    setActive(active: boolean) {
        if (this.nodeActive != active) {
            this.nodeActive = active
            if (active) {

                //获取一个真实节点
                let node = this.virtualList.getNode()
                //设置真实节点的数据
                this.virtualList.onSet(node, this.data, this.index)
                //将真实节点加入虚拟节点
                this.node.addChild(node)
            } else {

                //直接销毁真实节点
                let node = this.node.children[0]
                node.destroy()
            }
        }
    }

    /**
     * 在X轴方向上检查是否在可视区域
     */
    checkOutX() {
        let list最右边x = this.virtualList.node.width / 2
        let item最左边x = this.node.x + this.node.parent.x - this.node.width / 2
        if (item最左边x > list最右边x) {
            //不显示
            this.setActive(false)
        } else {
            let list最左边x = -list最右边x
            let item最右边x = item最左边x + this.node.width
            if (item最右边x < list最左边x) {
                this.setActive(false)
            } else {
                this.setActive(true)
            }
        }
    }

    /**
     * 在Y轴方向上检查是否在可视区域
     */
    checkOutY() {
        let list最上边Y = this.virtualList.node.height / 2
        let item最下边y = this.node.y + this.node.parent.y - this.node.height / 2
        if (item最下边y > list最上边Y) {
            //不显示
            this.setActive(false)
        } else {
            let list最下边Y = -list最上边Y
            let item最上边y = item最下边y + this.node.height
            if (item最上边y < list最下边Y) {
                this.setActive(false)
            } else {
                this.setActive(true)
            }
        }
    }
}
