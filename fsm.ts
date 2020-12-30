/**
 * 状态上下文
 */
export default abstract class Context {
    state: State<Context>
    changeState(state: State<Context>) {
        if (this.state) this.state.onExit()
        this.state = state
        if (this.state) {
            this.state.context = this
            this.state.onEnter()
        }
    }
}

/**
 * 状态
 */
export interface State<T> {
    context: T
    /** 进入状态 */
    onEnter(): void
    /** 更新状态 */
    onUpdate(dt:number): void
    /** 退出状态 */
    onExit(): void
}

// --------------------------例子--------------------------
// export class 使用状态机的类 extends Context {
//     state: 类的状态基类
// }

// class 类的状态基类 implements State<使用状态机的类> {
//     context: 使用状态机的类
//     onEnter(): void {
//         throw new Error("Method not implemented.")
//     }
//     onUpdate(): void {
//         throw new Error("Method not implemented.")
//     }
//     onExit(): void {
//         throw new Error("Method not implemented.")
//     }
// }