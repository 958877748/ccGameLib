const { ccclass, property } = cc._decorator

/**
 * 根据世界运行顺序
 * 在想要搜索周围组件的代码处启用这个组件,然后给一个回调
 * 然后物理世界运行 检测碰撞 list里面全是检测到的
 * 然后在 lateUpdate 回调,并关闭本组件
 */
@ccclass
export default class Search extends cc.Component {

    list: Array<cc.PhysicsCollider> = []

    fun: (list: cc.PhysicsCollider[]) => void = null

    test(fun: (list: cc.PhysicsCollider[]) => void) {
        this.fun = fun
    }

    protected lateUpdate(dt: number): void {
        this.fun(this.list)
        this.node.destroy()
    }

    onBeginContact(contact: any, self: any, other: cc.PhysicsCollider) {
        this.list.push(other)
    }

    onEndContact(contact: any, self: any, other: cc.PhysicsCollider) {
        let index = this.list.indexOf(other)
        if (index >- 1) {
            this.list.splice(index, 1)
        }
    }
}