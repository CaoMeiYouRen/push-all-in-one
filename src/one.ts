import { CustomEmail, Dingtalk, Discord, IGot, OneBot, PushDeer, PushPlus, Qmsg, ServerChanTurbo, ServerChanV3, Telegram, WechatApp, WechatRobot, XiZhi } from './index'
import { SendResponse } from '@/interfaces/response'

const PushAllInOne = {
    CustomEmail,
    Dingtalk,
    Discord,
    IGot,
    OneBot,
    PushDeer,
    PushPlus,
    Qmsg,
    ServerChanTurbo,
    ServerChanV3,
    Telegram,
    WechatApp,
    WechatRobot,
    XiZhi,
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
 * @date 2024-11-09
 * @export
 * @template T
 * @param title 推送标题
 * @param desp 推送内容
 * @param pushConfig 推送配置
 */
export async function runPushAllInOne<T extends PushType>(title: string, desp: string, pushConfig: MetaPushConfig<T>): Promise<SendResponse<any>> {
    const { type, config, option } = pushConfig
    if (PushAllInOne[type]) {
        const push = new PushAllInOne[type](config as any)
        return push.send(title, desp, option as any)
    }
    throw new Error('未匹配到任何推送方式！')
}
