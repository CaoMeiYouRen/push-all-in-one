import { ajax } from './utils/ajax'
import { CustomEmail, Dingtalk, Discord, Feishu, IGot, Ntfy, OneBot, PushDeer, PushPlus, Qmsg, ServerChanTurbo, ServerChanV3, Telegram, WechatApp, WechatRobot, XiZhi, WxPusher } from './index'
import { SendResponse } from '@/interfaces/response'

export const PushAllInOne = {
    CustomEmail,
    Dingtalk,
    Discord,
    Feishu,
    IGot,
    Ntfy,
    OneBot,
    PushDeer,
    PushPlus,
    Qmsg,
    ServerChanTurbo,
    ServerChanV3,
    Telegram,
    WechatApp,
    WechatRobot,
    WxPusher,
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

export type MetaCloudPushConfig<T extends PushType = PushType> = {
    type: T
    config: ConstructorParameters<IPushAllInOne[T]>[0]
    option: Parameters<IPushAllInOne[T]['prototype']['send']>[2]
    /**
     * push-all-in-cloud 服务器地址
     */
    baseUrl: string
    /**
     * push-all-in-cloud AUTH_FORWARD_KEY 鉴权密钥
     */
    authToken: string
}

/**
 * 调用 push-all-in-cloud 服务进行推送
 *
 * @author CaoMeiYouRen
 * @date 2025-11-06
 * @export
 * @template T
 * @param title 推送标题
 * @param desp 推送内容
 * @param pushConfig 推送配置
 */
export async function runPushAllInCloud<T extends PushType>(title: string, desp: string, pushConfig: MetaCloudPushConfig<T>): Promise<SendResponse<any>> {
    const { type, config, option, baseUrl, authToken } = pushConfig

    const payload = {
        title,
        desp,
        type,
        config,
        option,
    }
    const url = new URL(baseUrl)
    url.pathname = '/forward'
    const response = await ajax({
        url: url.toString(),
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
        },
        data: payload,
    })

    if (!response.status || response.status >= 400) {
        throw new Error(`推送请求失败，状态码：${response.status}`)
    }

    const data = response.data
    return data as SendResponse<any>
}
