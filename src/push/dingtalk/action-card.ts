// 整体跳转
export type OverallJump = {
    // 单个按钮的标题。设置此项和 singleURL 后，btns无效。
    singleTitle: string
    // 点击消息跳转的URL
    singleURL: string
}

// 独立跳转
export type IndependentJump = {
    btns: {
        // 按钮的标题
        title: string
        // 点击按钮触发的URL
        actionURL: string
    }[]
}

/**
 * 动作卡片消息
 *
 * @author CaoMeiYouRen
 * @date 2024-11-09
 * @export
 * @interface ActionCard
 */
export interface ActionCard {
    msgtype: 'actionCard'
    actionCard: {
        // 首屏会话透出的展示内容
        title: string
        // markdown 格式的消息内容
        text: string
        // 0：按钮竖直排列；1：按钮横向排列
        btnOrientation?: '0' | '1'
    } & (OverallJump | IndependentJump)
}

