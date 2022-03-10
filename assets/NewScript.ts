// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import VirtualList from "./lib/VirtualList";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property([cc.String])
    array = ['aaa']

    @property(VirtualList)
    vlist: VirtualList<string> = null

    protected start(): void {
        this.vlist.onSet = (n, d, i) => {
            n.getComponent(cc.Label).string = d
        }
    }

    click() {
        this.vlist.datas = this.array
    }
}
