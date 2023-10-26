const { ccclass, property } = cc._decorator

enum VJstate {
    default, stop, move
}

/**
 * 虚拟摇杆,监听这(VJmove,VJstop)2个事件处理即可
 */
@ccclass
export default class VirtualJoystick extends cc.Component {
    static VJmove = 'VJmove'
    static VJstop = 'VJstop'
    /**
     * 触摸区域
     */
    @property(cc.Node)
    touch: cc.Node = null

    /**
     * 摇杆
     */
    @property(cc.Node)
    joystick: cc.Node = null

    /**
     * 摇杆帽
     */
    @property(cc.Node)
    handle: cc.Node = null

    /**
     * 摇杆帽可以移动的最大范围
     */
    @property
    max = 100

    /**
     * 虚拟摇杆的当前状态
     */
    state = VJstate.default

    /**
     * 触摸点开始坐标
     */
    startV2 = cc.v2()

    /**
     * 触摸点开始点 指向 当前触摸点的向量 
     */
    v2 = cc.v2()

    /** 
     * 当前追踪的触摸点id
     */
    private etid: number = null

    onEnable() {
        //监听触摸事件
        this.touch.on(cc.Node.EventType.TOUCH_START, this.TOUCH_START, this)
        this.touch.on(cc.Node.EventType.TOUCH_MOVE, this.TOUCH_MOVE, this)
        this.touch.on(cc.Node.EventType.TOUCH_CANCEL, this.TOUCH_END, this)
        this.touch.on(cc.Node.EventType.TOUCH_END, this.TOUCH_END, this)
        this.scheduleOnce(() => {
            let comp = this.getComponent(cc.Widget)
            if (comp) comp.destroy()
        }, 1)
    }

    onDisable() {
        this.touch.off(cc.Node.EventType.TOUCH_START, this.TOUCH_START, this)
        this.touch.off(cc.Node.EventType.TOUCH_MOVE, this.TOUCH_MOVE, this)
        this.touch.off(cc.Node.EventType.TOUCH_CANCEL, this.TOUCH_END, this)
        this.touch.off(cc.Node.EventType.TOUCH_END, this.TOUCH_END, this)
        this.changestate(VJstate.default)
    }

    changestate(state: VJstate) {
        this.state = state
    }


    private TOUCH_START(e: cc.Event.EventTouch) {
        //如果当前是 默认状态 停止状态 
        if (this.state === VJstate.stop || this.state === VJstate.default) {

            //记录追踪的触摸点id
            this.etid = e.getID()

            //找到触摸点的开始坐标
            this.touch.convertToNodeSpaceAR(e.getLocation(), this.startV2)

            //state
            this.changestate(VJstate.move)

            //显示摇杆
            this.joystick.active = true
            //摇杆的位置
            this.joystick.setPosition(this.startV2)
            //摇杆帽当前点
            this.handle.setPosition(this.v2)
        }
    }


    private TOUCH_MOVE(e: cc.Event.EventTouch) {
        //如果是移动状态
        if (this.state === VJstate.move) {

            //且当前触摸点id能对应的上
            if (this.etid === e.getID()) {

                //找到当前触摸点位置
                this.touch.convertToNodeSpaceAR(e.getLocation(), this.v2)

                //用减法算出 开始点指向当前点的向量
                this.v2.subSelf(this.startV2)

                //不能超过最大值
                let len = this.v2.len()
                if (len > this.max) {
                    this.v2.mulSelf(this.max / len)
                }

                //设置摇杆帽位置
                this.handle.setPosition(this.v2)

                //event
                cc.systemEvent.emit(VirtualJoystick.VJmove, this.v2)
            }
        }
    }

    private TOUCH_END(e: cc.Event.EventTouch) {
        //当前是移动状态
        if (this.state === VJstate.move) {

            //触摸点id追踪正确
            if (this.etid === e.getID()) {
                //切换到停止状态
                this.changestate(VJstate.stop)

                //隐藏摇杆
                this.joystick.active = false

                //设置为0
                this.v2.x = 0
                this.v2.y = 0

                //event
                cc.systemEvent.emit(VirtualJoystick.VJstop)
            }
        }
    }
}
