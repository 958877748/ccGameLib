const { ccclass, property, menu, help } = cc._decorator;

@ccclass
@menu('Lib/SwitchText')
@help("http://www.baidu.com")
export default class SwitchText extends cc.Component {

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
