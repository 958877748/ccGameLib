/**
 * 状态上下文
 */
export interface Context {
    state: State<Context>
}

export function changeState(context: Context, cls: { new(): State<Context> }, pars?: any) {
    if (context.state) {
        context.state.onExit()
    }

    context.state = new cls()

    if (context.state) {
        context.state.context = context
        if (pars) {
            for (const key in pars) {
                const par = pars[key]
                context.state[key] = par
            }
        }
        context.state.onEnter()
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