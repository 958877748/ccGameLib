const { ccclass, property } = cc._decorator

@ccclass
export default class CollisionManager extends cc.Component {

    @property({
        tooltip: '当前节点的group影响debug绘制位置'
    })
    debug = false

    onEnable() {
        // 获取碰撞检测系统：
        var manager = cc.director.getCollisionManager()
        // 默认碰撞检测系统是禁用的，如果需要使用则需要以下方法开启碰撞检测系统：
        manager.enabled = true
        //默认碰撞检测系统的 debug 绘制是禁用的，如果需要使用则需要以下方法开启 debug 绘制：
        if (this.debug) manager.enabledDebugDraw = true
    }
}