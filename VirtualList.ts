import Item from "./Item";
import { scheduleOnce } from "./Util";

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('列表/List')
export default class List<T> extends cc.Component {
    private static pool = new cc.NodePool()

    @property(cc.Node)
    item: cc.Node = null

    content: cc.Node

    scrollView: cc.ScrollView

    handle: {
        pool: cc.NodePool
        the: any,
        fun: (node: cc.Node, data: T, index: number) => void
    }

    private _datas: Array<T>
    public get datas(): Array<T> {
        return this._datas
    }
    public set datas(value: Array<T>) {
        this._datas = value
        let index = 0
        let children = this.content.children
        for (; index < children.length; index++) {
            let data = this._datas[index]
            let node = children[index]
            let item = node.getComponent(Item)
            if (data) {
                item.data = data
                item.index = index
                item.refresh()
            } else {
                let node0 = node.children[0]
                this.returnNode(node0)
                node.parent = null
                List.pool.put(node)
                index--
            }
        }
        for (; index < this._datas.length; index++) {

            let data = this._datas[index]

            //空item对象
            let item = List.pool.get()
            if (item == null) {
                item = new cc.Node()
                item.addComponent(Item)
            }
            item.name = `${index}`
            item.x = 0
            item.y = 0
            item.width = this.item.width
            item.height = this.item.height
            item.getComponent(Item).setdata(this, index, data)

            this.content.addChild(item)
        }
        // this.content.emit(cc.Node.EventType.POSITION_CHANGED)
    }

    /** 获取一个实际显示的节点 */
    getNode() {
        let node = this.handle.pool.get()
        if (node == null) {
            node = cc.instantiate(this.item)
            node.x = 0
            node.y = 0
            node.active = true
        }
        return node
    }

    /** 返还一个实际显示的节点 */
    returnNode(node: cc.Node) {
        if (node == null) return
        node.parent = null
        scheduleOnce(() => {
            this.handle.pool.put(node)
        })
    }

    /** 设置node的显示 */
    setNode(item: Item, node: cc.Node) {
        this.handle.fun.call(this.handle.the, node, item.data, item.index)
    }

    onEnable() {
        this.scrollView = this.getComponent(cc.ScrollView)
        this.content = this.scrollView.content
        if (this.content == null) {
            throw Error('没有设置 sorcllView 的 content')
        } else {
            if (this.scrollView.vertical) {
                this.content.anchorY = 1
            }
        }
    }

    returnPool() {
        this.scrollView.stopAutoScroll()
        let items = this.content.children.slice()
        for (let index = 0; index < items.length; index++) {
            let item = items[index]
            let node = item.children[0]
            this.returnNode(node)
            item.parent = null
            List.pool.put(item)
        }
    }

    onDisable() {
        this.returnPool()
    }
}







import List from "./List"

const { ccclass, property, menu } = cc._decorator

@ccclass
@menu('列表/Item')
export default class Item extends cc.Component {

    list: List<any>
    index: number
    data: any
    /**
     * 
     * @param list 
     * @param index 
     * @param data 
     */
    setdata(list: List<any>, index: number, data: any) {
        this.list = list
        this.index = index
        this.data = data
        this.item_active = false
        //水平滚动还是垂直滚动
        if (this.list.scrollView.vertical) {
            //垂直滚动
            this.checkOut = this.checkOutY
        } else {
            this.checkOut = this.checkOutX
        }
    }

    onEnable() {
        this.list.content.on(cc.Node.EventType.POSITION_CHANGED, this.checkOut, this)
        this.node.on(cc.Node.EventType.POSITION_CHANGED, this.checkOut, this)
    }

    checkOut() {
        console.log('checkOut')
    }

    item_active: boolean

    setActive(active: boolean) {
        if (this.item_active != active) {
            this.item_active = active
            if (active) {
                let node = this.list.getNode()
                this.list.setNode(this, node)
                this.node.addChild(node)
            } else {
                let node = this.node.children[0]
                this.list.returnNode(node)
            }
        }
    }

    checkOutX() {
        let list最右边x = this.list.node.width / 2
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

    checkOutY() {
        let list最上边Y = this.list.node.height / 2
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

    onDisable() {
        this.list.content.off(cc.Node.EventType.POSITION_CHANGED, this.checkOut, this)
        this.node.off(cc.Node.EventType.POSITION_CHANGED, this.checkOut, this)
        let node = this.node.children[0]
        if (node)
            this.list.returnNode(node)
    }

    refresh() {
        if (this.item_active) {
            let node = this.node.children[0]
            this.list.setNode(this, node)
        }
    }
}