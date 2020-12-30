// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property, menu, help } = cc._decorator;

@ccclass
@menu('switch/text')
@help("http://www.baidu.com")
export default class switchText extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null

    @property([cc.String])
    array: Array<string> = []

    set index(index: number) {
        let text = this.array[index]
        if (text) {
            this.label.string = text
        } else {
            this.label.string = ''
        }
    }

    resetInEditor() {
        let label = this.getComponent(cc.Label)
        if (label) {
            this.label = label
        } else {
            this.label = this.addComponent(cc.Label)
        }
    }
}
