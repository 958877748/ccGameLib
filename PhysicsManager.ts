const { ccclass, property } = cc._decorator

@ccclass
export default class PhysicsSystem extends cc.Component {

    @property({ tooltip: '当前节点的group影响debug绘制位置' })
    debug = false

    @property(cc.Vec2)
    gravity = cc.v2()

    onEnable() {

        //开启物理系统
        //物理系统默认是关闭的，如果需要使用物理系统
        //那么首先需要做的事情就是开启物理系统
        //否则你在编辑器里做的所有物理编辑都不会产生任何效果。
        let sys = cc.director.getPhysicsManager()
        sys.enabled = true

        //绘制物理调试信息
        //物理系统默认是不绘制任何调试信息的
        //如果需要绘制调试信息，请使用 debugDrawFlags。 
        //物理系统提供了各种各样的调试信息
        //你可以通过组合这些信息来绘制相关的内容。
        if (this.debug) {
            sys.debugDrawFlags =
                // cc.PhysicsManager.DrawBits.e_aabbBit |
                // cc.PhysicsManager.DrawBits.e_pairBit |
                // cc.PhysicsManager.DrawBits.e_centerOfMassBit |
                // cc.PhysicsManager.DrawBits.e_jointBit |
                cc.PhysicsManager.DrawBits.e_shapeBit

            //设置分组
            sys['_debugDrawer'].node.group = this.node.group
        }

        //设置物理重力
        //重力是物理表现中非常重要的一点
        //大部分物理游戏都会使用到重力这一物理特性
        //默认的重力加速度是(0, -320) 世界单位 / 秒 ^ 2
        //按照上面描述的转换规则，即(0, -10) 米 / 秒 ^ 2。
        //如果希望重力加速度为 0，可以这样设置：
        sys.gravity = this.gravity
    }
}