// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class TiledMaps extends cc.Component {

    @property([cc.TiledMapAsset])
    array: Array<cc.TiledMapAsset> = []

    obj: { [x: string]: cc.TiledMapAsset } = {}

    onLoad() {
        let array = this.array
        for (let index = 0; index < array.length; index++) {
            const tiledMap = array[index]
            this.obj[tiledMap.name] = tiledMap
        }
        this.array = null
    }

    get(name: string): cc.TiledMapAsset {
        let tiledMap = this.obj[name]
        if (tiledMap) {
            return tiledMap
        } else {
            if (CC_DEV) console.error('tiledMap.get.name', name)
        }
    }
}
