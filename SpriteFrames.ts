const { ccclass, property } = cc._decorator

@ccclass
export default class SpriteFrames extends cc.Component {

    @property([cc.SpriteFrame])
    array: Array<cc.SpriteFrame> = []

    obj: { [x: string]: cc.SpriteFrame } = {}

    onLoad() {
        let array = this.array
        for (let index = 0; index < array.length; index++) {
            const prefab = array[index]
            this.obj[prefab.name] = prefab
        }
        this.array = null
    }

    get(name: string): cc.SpriteFrame {
        let prefab = this.obj[name]
        if (prefab) {
            return prefab
        } else {
            if (CC_DEV) console.error('prefabs.get.name', name)
        }
    }
}
