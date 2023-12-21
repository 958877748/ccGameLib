const { ccclass } = cc._decorator

@ccclass
export default class AreaColliderTest extends cc.Component {
  list: Array<cc.Collider> = []
  onCollisionEnter(other: cc.Collider) {
    this.list.push(other)
  }
  onCollisionExit(other: cc.Collider) {
    let index = this.list.indexOf(other)
    if (index > -1) {
      this.list.splice(index, 1)
    }
  }
}
