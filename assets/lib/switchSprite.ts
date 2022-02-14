// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property, menu, help } = cc._decorator;

@ccclass
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
        let sprite = this.getComponent(cc.Sprite)
        if (sprite) {
            this.sprite = sprite
        } else {
            this.sprite = this.addComponent(cc.Sprite)
        }
    }
}
