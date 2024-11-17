import debug from 'debug'
import { Send } from '@/interfaces/send'
import { ajax } from '@/utils/ajax'
import { SendResponse } from '@/interfaces/response'
import { ConfigSchema, OptionSchema } from '@/interfaces/schema'
import { validate } from '@/utils/validate'

const Debugger = debug('push:server-chan-turbo')

export type ChannelValue = 98 | 66 | 1 | 2 | 3 | 8 | 0 | 88 | 18 | 9

export type Channel = `${ChannelValue}` | `${ChannelValue}|${ChannelValue}`

export interface ServerChanTurboConfig {
    /**
     * Server酱 Turbo 的 SCTKEY
     * 请前往 https://sct.ftqq.com/sendkey 领取
     */
    SERVER_CHAN_TURBO_SENDKEY: string
}

export type ServerChanTurboConfigSchema = ConfigSchema<ServerChanTurboConfig>
export const serverChanTurboConfigSchema: ServerChanTurboConfigSchema = {
    SERVER_CHAN_TURBO_SENDKEY: {
        type: 'string',
        title: 'SCTKEY',
        description: 'Server酱 Turbo 的 SCTKEY。请前往 https://sct.ftqq.com/sendkey 领取',
        required: true,
    },
} as const

/**
 * 附加参数
 */
export type ServerChanTurboOption = {
    /**
     *  消息卡片内容，选填。最大长度 64。如果不指定，将自动从 desp 中截取生成。
     */
    short?: string
    /**
     * 是否隐藏调用 IP，选填。如果不指定，则显示；为 1 则隐藏。
     */
    noip?: '1' | 1 | true
    /**
     * 动态指定本次推送使用的消息通道，选填。如不指定，则使用网站上的消息通道页面设置的通道。支持最多两个通道，多个通道值用竖线 "|" 隔开。
     * 通道对应的值如下：
     * 官方Android版·β=98
     * 企业微信应用消息=66
     * 企业微信群机器人=1
     * 钉钉群机器人=2
     * 飞书群机器人=3
     * Bark iOS=8
     * 测试号=0
     * 自定义=88
     * PushDeer=18
     * 方糖服务号=9
     */
    channel?: Channel
    /**
     * 消息抄送的 openid，选填。只支持测试号和企业微信应用消息通道。多个 openid 用 "," 隔开。企业微信应用消息通道的 openid 参数，内容为接收人在企业微信中的 UID，多个人请 "|" 隔开。
     */
    openid?: string
}

export type ServerChanTurboOptionSchema = OptionSchema<{
    short?: string
    openid?: string
    channel?: string
    noip?: boolean
}>
export const serverChanTurboOptionSchema: ServerChanTurboOptionSchema = {
    short: {
        type: 'string',
        title: '消息卡片内容',
        description: '选填。最大长度 64。如果不指定，将自动从 desp 中截取生成。',
        required: false,
    },
    noip: {
        type: 'boolean',
        title: '是否隐藏调用 IP',
        description: '选填。如果不指定，则显示；为 1/true 则隐藏。',
        required: false,
    },
    channel: {
        type: 'string',
        title: '消息通道',
        description: '选填。动态指定本次推送使用的消息通道，支持最多两个通道，多个通道值用竖线 "|" 隔开。',
        required: false,
    },
    openid: {
        type: 'string',
        title: '消息抄送的 openid',
        description: '选填。只支持测试号和企业微信应用消息通道。多个 openid 用 "," 隔开。企业微信应用消息通道的 openid 参数，内容为接收人在企业微信中的 UID，多个人请 "|" 隔开。',
        required: false,
    },
}

export interface ServerChanTurboResponse {
    // 0 表示成功，其他值表示失败
    code: number
    message: string
    data: {
        // 推送消息的 ID
        pushid: string
        // 推送消息的阅读凭证
        readkey: string
        error: string
        errno: number
    }
}

/**
 * Server 酱·Turbo
 * 文档 https://sct.ftqq.com/
 *
 * @author CaoMeiYouRen
 * @date 2021-02-27
 * @export
 * @class ServerChanTurbo
 */
export class ServerChanTurbo implements Send {

    static configSchema = serverChanTurboConfigSchema
    static optionSchema = serverChanTurboOptionSchema

    /**
     *
     * @author CaoMeiYouRen
     * @date 2024-11-08
     * @param config 请前往 https://sct.ftqq.com/sendkey 领取
     */
    constructor(config: ServerChanTurboConfig) {
        const { SERVER_CHAN_TURBO_SENDKEY } = config
        this.SCTKEY = SERVER_CHAN_TURBO_SENDKEY
        Debugger('set SCTKEY: "%s"', this.SCTKEY)
        // 根据 configSchema 验证 config
        validate(config, ServerChanTurbo.configSchema)
    }
    /**
     *
     *
     * @private 请前往 https://sct.ftqq.com/sendkey 领取
     */
    private SCTKEY: string

    /**
     * 发送消息
     *
     * @author CaoMeiYouRen
     * @date 2024-11-08
     * @param title 消息的标题
     * @param [desp=''] 消息的内容，支持 Markdown
     * @param [option={}] 额外发送选项
     */
    async send(title: string, desp: string = '', option: ServerChanTurboOption = {}): Promise<SendResponse<ServerChanTurboResponse>> {
        Debugger('title: "%s", desp: "%s", option: %O', title, desp, option)
        if (option.noip === 1 || option.noip === true) {
            option.noip = '1'
        }
        const data = {
            text: title,
            desp,
            ...option,
        }
        return ajax({
            url: `https://sctapi.ftqq.com/${this.SCTKEY}.send`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            data,
        })
    }
}
