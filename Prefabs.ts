const { ccclass, property } = cc._decorator

@ccclass
export default class Prefabs extends cc.Component {

    @property([cc.Prefab])
    array: Array<cc.Prefab> = []

    obj: { [x: string]: cc.Prefab } = {}

    onLoad() {
        let array = this.array
        for (let index = 0; index < array.length; index++) {
            const prefab = array[index]
            this.obj[prefab.name] = prefab
        }
        this.array = null
    }

    get(name: string): cc.Prefab {
        let prefab = this.obj[name]
        if (prefab) {
            return prefab
        } else {
            if (CC_DEV) console.error('prefabs.get.name', name)
        }
    }
}
