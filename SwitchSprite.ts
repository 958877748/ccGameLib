const { ccclass, property, menu, help, requireComponent } = cc._decorator;

@ccclass
@requireComponent(cc.Sprite)
@menu('Lib/SwitchSprite')
@help("http://www.baidu.com")
export default class SwitchSprite extends cc.Component {

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
