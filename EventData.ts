// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

export default class EventData<T>  {
    private _value: T = null
    private comp: cc.Component
    private type: string

    /**
     * 创建一关可监听变化的数据
     * @param comp 监听事件放在那个组件的节点上
     * @param type 监听事件关键字,字段名
     * @param value 默认值
     */
    constructor(comp: cc.Component, type: string, value: T) {
        this.comp = comp
        this.type = type
        this._value = value
    }

    set value(value: T) {
        if (value !== this._value) {
            this._value = value
            this.emit()
        }
    }

    get value() {
        return this._value
    }

    /**
     * 监听数据变化
     * @param the 监听的组件
     * @param fun 组件的方法
     * @param isCall 是否立即回调
     */
    on(the: any, fun: Function, isCall = false) {
        this.comp.node.on(this.type, fun, the)
        if (isCall)
            fun.call(the, this._value)
    }

    /** 
     * 取消监听,传入监听时的参数
     */
    off(the: any, fun: Function) {
        this.comp.node.off(this.type, fun, the)
    }

    /** 
     * 派发数据变化事件
     */
    emit() {
        this.comp.node.emit(this.type, this._value)
    }
}
