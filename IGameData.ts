//子类继承写法示例

// 全局使用
// export var gamedata: GameData = null

// @ccclass
// export default class GameData extends IGameData {
//     protected getInstance() {
//         return gamedata
//     }
//     protected setInstance(data: GameData) {
//         gamedata = data
//     }
//     自定义属性
// }

const { ccclass, property } = cc._decorator

enum type {
    number = 0,
    string = 1,
    boolean = 2,
    object = 3
}

interface typeValue {
    type: type
    value: number | string | boolean | object
}

/**
 * 继承使用,子类实现getInstance/setInstance方法
 * 这个单例保存在子类那边
 */
@ccclass
export default class IGameData extends cc.Component {

    protected static get Type() {
        return type
    }

    protected getInstance(): IGameData {
        throw new Error("Method not implemented.")
    }
    protected setInstance(data: IGameData): void {
        throw new Error("Method not implemented.")
    }

    @property({ tooltip: '测试时生效' })
    private clearData = true

    @property
    private GameName = 'test'

    private localStorage: Storage = null

    onLoad() {
        this.localStorage = cc.sys.localStorage
        if (this.getInstance()) {
            cc.error('不能同时存在2个GameData组件')
        }
        this.setInstance(this)
        //初始化所有数据
        if (CC_DEBUG && this.clearData) {
            //测试时清除数据
        } else {
            let array = Object.keys(new IGameData())
            this.removeArray(array, '_openid')
            this.removeArray(array, '_music')
            this.removeArray(array, '_effect')
            for (const key in this) {
                if (Object.prototype.hasOwnProperty.call(this, key)) {
                    if (!array.includes(key)) {
                        let data = this.getItem(key)
                        if (data !== null) {
                            this[key] = data
                        }
                    }
                }
            }
        }
        //同步音乐音效
        cc.audioEngine.setMusicVolume(this.music ? 1 : 0)
        cc.audioEngine.setEffectsVolume(this.effect ? 1 : 0)
    }

    /**
     * 从某个列表删除一个元素
     */
    private removeArray<T>(array: Array<T>, item: T) {
        let index = array.indexOf(item)
        if (index > -1) {
            array.splice(index, 1)
        }
    }

    /**
     * 从本地缓存中取出一个value
     * @param key value对应的key
     */
    private getItem(key: string) {
        key = this.GameName + '_' + key
        let str = this.localStorage.getItem(key)
        if (str === null || str === undefined || str === '') {
            return null
        }
        let obj = JSON.parse(str)
        switch (obj.type) {
            case type.number: return obj.value;
            case type.string: return obj.value;
            case type.boolean: return obj.value;
            case type.object: return obj;
            default: return obj;
        }
    }

    private static VALUE_NUMBER: typeValue = { type: type.number, value: 0 }
    private static VALUE_STRING: typeValue = { type: type.string, value: '' }
    private static VALUE_BOOLEAN: typeValue = { type: type.boolean, value: true }
    private static VALUE_OBJECT: typeValue = { type: type.object, value: null }
    /**
     * 给本地缓存中保存一个key-value
     * @param key 
     * @param value 
     */
    protected setItem(key: string, value: any, _type: type) {
        let str = this.GameName + '_'
        switch (_type) {
            case type.number:
                IGameData.VALUE_NUMBER.value = value
                str = JSON.stringify(IGameData.VALUE_NUMBER)
                break;
            case type.string:
                IGameData.VALUE_STRING.value = value
                str = JSON.stringify(IGameData.VALUE_STRING)
                break;
            case type.boolean:
                IGameData.VALUE_BOOLEAN.value = value
                str = JSON.stringify(IGameData.VALUE_BOOLEAN)
                break;
            case type.object:
                IGameData.VALUE_OBJECT.value = value
                str = JSON.stringify(IGameData.VALUE_OBJECT)
                break;
            default:
                throw Error('[error]undefined by type:' + typeof value)
        }
        this.localStorage.setItem(key, str)
    }

    /**
     * 抛出事件
     * @param key 
     */
    protected emit(key: string) {
        this.node.emit(key, this[key])
    }

    /**
     * 监听某个数据发生变化
     * @param key 数据的key
     * @param the 回调组件
     * @param fun 回调函数
     * @param call 立刻回调 false
     */
    on(key: string, the: cc.Component, fun: Function, call = false) {
        this.node.on(key, fun, the)
        if (call) fun.call(the, this[key])
    }

    /**
     * 取消数据监听
     * @param key 
     * @param the 
     * @param fun 
     */
    off(key: string, the: cc.Component, fun: Function) {
        this.node.off(key, fun, the)
    }



    //-----------------默认属性-----------------↓
    private _openid: string = null
    /** openid */
    get openid() { return this._openid }
    set openid(value: string) {
        this._openid = value
        this.setItem('openid', value, type.string)
        this.emit('openid')
    }

    private _music = true
    /** 音乐 */
    get music() { return this._music }
    set music(value: boolean) {
        this._music = value
        this.setItem('music', value, type.boolean)
        this.emit('music')
        cc.audioEngine.setMusicVolume(value ? 1 : 0)
    }

    private _effect = true
    /** 音效 */
    get effect() { return this._effect }
    set effect(value: boolean) {
        this._effect = value
        this.setItem('effect', value, type.boolean)
        this.emit('effect')
        cc.audioEngine.setEffectsVolume(value ? 1 : 0)
    }
}
