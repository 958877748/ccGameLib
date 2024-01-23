// let cbm = new OnCallbacks(() => {
//     所有回调完成会走这里 
// })
// for (let index = 0; index < storages.length; index++) {
//     增加一个回调
//     cbm.add()
//     grid.initItem(storage, () => {
//         完成一个回调
//         cbm.remove()
//     })
// }
// 所有增加回调完了
// cbm.addEnd()

/**
 * 当多个回调完成时回调
 */
export default class OnCallbacks {
  private count = 0
  private isEnd = false
  private yes: () => void = null
  constructor(yes: () => void) {
    this.yes = yes
  }
  /**
   * 增加一个回调
   */
  add() {
    this.count++
  }
  /**
   * 增加回调结束 这之后 不会再有新的增加回调
   */
  addEnd() {
    this.isEnd = true
    if (this.count == 0) {
      this.yes()
    }
  }
  /**
   * 一个回调结束
   */
  remove() {
    this.count--
    if (this.isEnd && this.count == 0) {
      this.yes()
    }
  }
}