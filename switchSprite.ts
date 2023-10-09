// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property, menu, help, requireComponent } = cc._decorator;

@ccclass
@requireComponent(cc.Sprite)
@menu('switch/sprite')
@help("http://www.baidu.com")
export default class switchSprite extends cc.Component {

    @property(cc.Sprite)
    sprite: cc.Sprite = null

    @property([cc.SpriteFrame])
    array: Array<cc.SpriteFrame> = []

    set index(index: number) {
        this.sprite.spriteFrame = this.array[index]
    }

    resetInEditor() {
        this.sprite = this.getComponent(cc.Sprite)
    }
}
