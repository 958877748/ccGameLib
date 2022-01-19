/**
 * 状态上下文
 */
export interface Context {
    state: State<Context>
}

/**
 * 改变状态
 * @param context 状态上下文
 * @param cls 新的状态类
 * @param call 设置新状态的属性
 */
export function changeState<T extends State<Context>>(context: Context, cls: { new(): T }, call?: (state: T) => void) {
    if (context.state) {
        context.state.onExit()
    }

    let newState = new cls()
    if (newState) {
        context.state = newState
        newState.context = context
        if (call) {
            call(newState)
        }
        context.state.onEnter()
    } else {
        context.state = null
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
    onUpdate(dt: number): void
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