const { ccclass } = cc._decorator

interface item<T> extends cc.Component {
    set(data: T, index: number): void
}

/**
 * 将这个节点挂在 content 上
 * 使用 set 函数来设置显示的列表数据
 */
@ccclass
export default class showList extends cc.Component {
    /**
     * 设置列表数据
     */
    set<T1 extends item<T2>, T2>(type: { prototype: T1 }, datas: Array<T2>) {
        let index = 0
        let children = this.node.children

        //实例化缺少的节点
        for (; index < datas.length; index++) {
            let node = children[index]
            if (node == null) {
                node = cc.instantiate(children[0])
                node.parent = this.node
            }
            node.active = true
        }

        //删除多余的节点
        for (; index < children.length; index++) {
            if (index == 0) {
                children[index].active = false
            } else {
                children[index].destroy()
            }
        }

        //给每个节点设置数据
        for (let x = 0; x < datas.length; x++) {
            let data = datas[x]
            let node = children[x]
            let comp = node.getComponent(type)
            comp.set(data, x)
        }
    }
}
