import { ServerChanTurbo, ServerChanV3, CustomEmail, Dingtalk, WechatRobot, WechatApp, PushPlus, IGot, Qmsg, XiZhi, PushDeer, Discord, OneBot, Telegram } from '../src'
import { SendResponse } from '../src/interfaces/response'

// 获取 每个 推送渠道的构造函数的 类型

export const PushAllInOne = {
    ServerChanTurbo,
    ServerChanV3,
    CustomEmail,
    Dingtalk,
    WechatRobot,
    WechatApp,
    PushPlus,
    IGot,
    Qmsg,
    XiZhi,
    PushDeer,
    Discord,
    OneBot,
    Telegram,
} as const

export type IPushAllInOne = typeof PushAllInOne

export type PushType = keyof IPushAllInOne

export type MetaPushConfig<T extends PushType = PushType> = {
    type: T
    config: ConstructorParameters<IPushAllInOne[T]>[0]
    option: Parameters<IPushAllInOne[T]['prototype']['send']>[2]
}

/**
 * 从传入变量中读取配置，并选择一个渠道推送
 *
 * @author CaoMeiYouRen
 * @date 2023-10-25
 * @export
 * @param title
 * @param desp
 * @param pushConfig
 */
export async function runPushAllInOne<T extends PushType>(title: string, desp: string, pushConfig: MetaPushConfig<T>): Promise<SendResponse<any>> {
    const { type, config, option } = pushConfig
    if (PushAllInOne[type]) {
        const push = new PushAllInOne[type](config as any)
        return push.send(title, desp, option as any)
    }
    throw new Error('未匹配到任何推送方式！')
}

// runPushAllInOne('测试推送', '测试推送', {
//     type: 'ServerChanTurbo',
//     config: {
//         SERVER_CHAN_TURBO_SENDKEY: '',
//     },
//     option: {
//     },
// })
