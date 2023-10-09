import VirtualItem from "./VirtualItem"

const { ccclass, property, menu } = cc._decorator

/**
 * 虚拟列表 只显示能看见的 
 * 看不见的用空节点代替
 * item-代表虚拟子节点
 * node-代表真实子节点
 */
@ccclass
@menu('List/VirtualList')
export default class VirtualList<T> extends cc.Component {
    /**
     * 真实节点预制体
     */
    @property(cc.Node)
    nodePrefab: cc.Node = null

    /** 
     * 容器-包含所有列表项的父节点
     */
    content: cc.Node = null

    /**
     * 容器上的排序子节点的组件
     */
    layout: cc.Layout = null

    /**
     * 滑动区域组件 
     */
    @property(cc.ScrollView)
    ScrollView: cc.ScrollView = null

    /** 
     * 设置一个列表项的数据
     * @param node 真实的列表项节点
     * @param data 一条数据
     * @param index 下标
     */
    onSet: (node: cc.Node, data: T, index: number) => void

    onEnable() {
        this.content = this.ScrollView.content
        this.layout = this.content.getComponent(cc.Layout)
        if (this.content == null) {
            throw Error('没有设置 sorcllView 的 content')
        } else {
            if (this.ScrollView.vertical) {
                this.content.anchorY = 1
            }
        }
    }

    /**
     * 列表数据
     */
    private _datas: Array<T> = null

    public get datas(): Array<T> {
        return this._datas
    }
    /**
     * 设置列表显示的数据
     * @param datas 数据列表
     */
    public set datas(datas: Array<T>) {
        this._datas = datas

        //立即停止自动滚动
        this.ScrollView.stopAutoScroll()

        let index = 0
        let children = this.content.children

        //根据数据的长度 创建缺少的虚拟子节点
        for (; index < datas.length; index++) {
            let item = children[index]
            let data = datas[index]

            if (item == null) {
                //没有对应的节点
                //创建一个
                item = new cc.Node()
                //大小同真实节点
                item.width = this.nodePrefab.width
                item.height = this.nodePrefab.height
                //加上组件 以便控制
                let virtualItem: VirtualItem<T> = item.addComponent(VirtualItem)
                virtualItem.init(this, index, data)

                //加入容器中
                this.content.addChild(item)
            } else {
                //有对应的节点 拿到组件 刷新显示
                let virtualItem: VirtualItem<T> = item.addComponent(VirtualItem)
                virtualItem.refresh(data)
            }
        }

        //根据虚拟子节点列表的长度 删除或回收多余的虚拟子节点
        for (; index < children.length; index++) {
            let item = children[index]
            //直接销毁
            item.destroy()
        }

        //Layout需要重新对齐排序
        this.layout.updateLayout()
    }

    /** 
     * 获取一个真实显示的节点
     */
    getNode() {
        let node = cc.instantiate(this.nodePrefab)
        node.x = 0
        node.y = 0
        node.active = true
        return node
    }
}
