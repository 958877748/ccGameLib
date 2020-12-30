interface handle {
    fun: Function,
    the: cc.Component
}

@cc._decorator.ccclass
export default class gameData extends cc.Component {
    /**
     * 所有监听
     */
    private allhandles: { [x: string]: { [x: string]: handle } } = {}

    /**
     * 从本地缓存中取出一个value
     * @param key value对应的key
     */
    private getItem(key: string) {
        let str = cc.sys.localStorage.getItem(key)
        if (!str) return null
        let obj = JSON.parse(str)
        if (obj) {
            if (obj.type == 'number') {
                return obj.value

            } else if (obj.type == 'string') {
                return obj.value

            } else if (obj.type == 'boolean') {
                return obj.value

            } else {
                return obj
            }
        } else {
            return null
        }
    }

    /**
     * 给本地缓存中保存一个key-value
     * @param key 
     * @param value 
     */
    protected setItem(key: string, value: any) {
        let type = typeof value
        if (type == 'number') {
            let obj = { type: 'number', value: value }
            let str = JSON.stringify(obj)
            cc.sys.localStorage.setItem(key, str)

        } else if (type == 'string') {
            let obj = { type: 'string', value: value }
            let str = JSON.stringify(obj)
            cc.sys.localStorage.setItem(key, str)

        } else if (type == 'boolean') {
            let obj = { type: 'boolean', value: value }
            let str = JSON.stringify(obj)
            cc.sys.localStorage.setItem(key, str)

        } else {
            let str = JSON.stringify(value)
            cc.sys.localStorage.setItem(key, str)
        }
    }

    /**
     * 抛出事件锁定,防止抛出事件中途,监听列表发生变化
     */
    private emitLock = false
    /**
     * 抛出事件
     * @param key 
     */
    protected emit(key: string) {
        let handles = this.allhandles[key]
        if (handles) {
            this.emitLock = true
            for (const x in handles) {
                const handle = handles[x]
                handle.fun.call(handle.the)
            }
            this.emitLock = false
        }
    }

    /**
     * 监听某个数据发生变化
     * @param key 数据的key
     * @param the 回调组件
     * @param fun 回调函数
     * @param call 立刻回调 false
     */
    on(key: string, the: cc.Component, fun: Function, call = false) {
        if (this.emitLock) {
            throw Error('GameData.emitLock 正在抛出事件')
        }
        let handle = { the: the, fun: fun }
        let handles = this.allhandles[key]
        if (handles) {
            handles[the.uuid] = handle
        } else {
            handles = {}
            handles[the.uuid] = handle
            this.allhandles[key] = handles
        }
        if (call) fun.call(the)
    }

    /**
     * 取消数据监听
     * @param key 
     * @param the 
     * @param fun 
     */
    off(key: string, the: cc.Component) {
        if (this.emitLock) {
            throw Error('GameData.emitLock 正在抛出事件')
        }
        let handles = this.allhandles[key]
        if (handles) {
            let handle = handles[the.uuid]
            if (handle) {
                delete handles[the.uuid]
            } else {
                throw Error('GameData.off key:' + key)
            }
        } else {
            throw Error('GameData.off key:' + key)
        }
    }

    onLoad() {
        //初始化所有数据
        for (const key in this) {
            const s_ = key.slice(0, 2)
            if (s_ == 's_') {
                const name = key.slice(2)
                let data = this.getItem(name)
                if (data != null) {
                    this[key] = data
                }
            }
        }
        //同步音乐音效
        cc.audioEngine.setMusicVolume(this.music ? 1 : 0)
        cc.audioEngine.setEffectsVolume(this.effect ? 1 : 0)
    }

    private s_music = true
    /** 音乐 */
    get music() {
        return this.s_music
    }
    set music(music: boolean) {
        if (this.s_music == music) {
            return
        }
        this.s_music = music
        this.setItem('music', music)
        this.emit('music')
        cc.audioEngine.setMusicVolume(music ? 1 : 0)
    }

    private s_effect = true
    /** 音效 */
    get effect() {
        return this.s_effect
    }
    set effect(effect: boolean) {
        if (this.s_effect == effect) {
            return
        }
        this.s_effect = effect
        this.setItem('effect', effect)
        this.emit('effect')
        cc.audioEngine.setEffectsVolume(effect ? 1 : 0)
    }
}