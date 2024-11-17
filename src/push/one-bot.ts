import debug from 'debug'
import { Send } from '@/interfaces/send'
import { ajax } from '@/utils/ajax'
import { warn } from '@/utils/helper'
import { SendResponse } from '@/interfaces/response'
import { ConfigSchema, OptionSchema } from '@/interfaces/schema'
import { validate } from '@/utils/validate'

const Debugger = debug('push:one-bot')

export interface OneBotConfig {
    /**
     * OneBot HTTP 基础路径
     */
    ONE_BOT_BASE_URL: string
    /**
     * OneBot AccessToken
     * 出于安全原因，请务必设置 AccessToken
     */
    ONE_BOT_ACCESS_TOKEN?: string
}

export type OneBotConfigSchema = ConfigSchema<OneBotConfig>
export const oneBotConfigSchema: OneBotConfigSchema = {
    ONE_BOT_BASE_URL: {
        type: 'string',
        title: 'OneBot HTTP 基础路径',
        description: 'OneBot HTTP 基础路径',
        required: true,
    },
    ONE_BOT_ACCESS_TOKEN: {
        type: 'string',
        title: 'OneBot AccessToken',
        description: '出于安全原因，请务必设置 AccessToken',
        required: false,
    },
} as const

export interface OneBotPrivateMsgOption {
    /**
     * 消息类型
     */
    message_type: 'private'
    /**
     * 对方 QQ 号
     */
    user_id: number
}

export interface OneBotGroupMsgOption {
    /**
     * 消息类型
     */
    message_type: 'group'
    /**
     * 群号
     */
    group_id: number

}

export type OneBotOption = (OneBotPrivateMsgOption | OneBotGroupMsgOption) & {
    /**
     * 消息内容是否作为纯文本发送（即不解析 CQ 码），只在 message 字段是字符串时有效
     */
    auto_escape?: boolean
}

export type OneBotMsgType = OneBotOption['message_type']

export type OneBotOptionSchema = OptionSchema<{
    // 消息类型，private 或 group
    message_type: OneBotMsgType
    // 如果为 private，对方 QQ 号
    user_id?: number
    // 如果为 group，群号
    group_id?: number
    // 消息内容是否作为纯文本发送（即不解析 CQ 码），只在 message 字段是字符串时有效
    auto_escape?: boolean
}>

export const oneBotOptionSchema: OneBotOptionSchema = {
    message_type: {
        type: 'select',
        title: '消息类型',
        description: '消息类型，private 或 group，默认为 private',
        required: true,
        default: 'private',
        options: [
            {
                label: '私聊',
                value: 'private',
            },
            {
                label: '群聊',
                value: 'group',
            },
        ],
    },
    user_id: {
        type: 'number',
        title: '对方 QQ 号',
        description: '对方 QQ 号',
        required: false,
    },
    group_id: {
        type: 'number',
        title: '群号',
        description: '群号',
        required: false,
    },
    auto_escape: {
        type: 'boolean',
        title: '消息内容是否作为纯文本发送（即不解析 CQ 码），只在 message 字段是字符串时有效',
        description: '消息内容是否作为纯文本发送（即不解析 CQ 码），只在 message 字段是字符串时有效',
        required: false,
    },
} as const

export interface OneBotData {
    ClassType: string
    // 消息 ID
    message_id: number
}

export interface OneBotResponse {
    status: string
    retcode: number
    data: OneBotData
    echo?: any
}

/**
 * OneBot。官方文档：https://github.com/botuniverse/onebot-11
 * 本项目实现的版本为 OneBot 11
 * @author CaoMeiYouRen
 * @date 2023-10-22
 * @export
 * @class OneBot
 */
export class OneBot implements Send {

    static configSchema = oneBotConfigSchema
    static optionSchema = oneBotOptionSchema

    /**
     *  OneBot 协议版本号
     *
     * @author CaoMeiYouRen
     * @date 2023-10-22
     * @static
     */
    static version = 11

    /**
     * OneBot HTTP 基础路径
     *
     * @author CaoMeiYouRen
     * @date 2023-10-22
     * @private
     * @example http://127.0.0.1
     */
    private ONE_BOT_BASE_URL: string
    /**
     * OneBot AccessToken
     * 出于安全原因，请务必设置 AccessToken
     * @author CaoMeiYouRen
     * @date 2023-10-22
     * @private
     */
    private ONE_BOT_ACCESS_TOKEN?: string

    /**
     * 创建 OneBot 实例
     * @author CaoMeiYouRen
     * @date 2024-11-08
     * @param config OneBot 配置
     */
    constructor(config: OneBotConfig) {
        const { ONE_BOT_BASE_URL, ONE_BOT_ACCESS_TOKEN } = config
        this.ONE_BOT_BASE_URL = ONE_BOT_BASE_URL
        this.ONE_BOT_ACCESS_TOKEN = ONE_BOT_ACCESS_TOKEN
        Debugger('set ONE_BOT_BASE_URL: "%s", ONE_BOT_ACCESS_TOKEN: "%s"', ONE_BOT_BASE_URL, ONE_BOT_ACCESS_TOKEN)
        // 根据 configSchema 验证 config
        validate(config, OneBot.configSchema)
        if (!this.ONE_BOT_ACCESS_TOKEN) {
            warn('未提供 ONE_BOT_ACCESS_TOKEN ！出于安全原因，请务必设置 AccessToken！')
        }
    }

    /**
     *
     *
     * @author CaoMeiYouRen
     * @date 2024-11-08
     * @param title 消息标题
     * @param desp 消息正文
     * @param option 额外推送选项
     */
    async send(title: string, desp: string, option: OneBotOption): Promise<SendResponse<OneBotResponse>> {
        Debugger('title: "%s", desp: "%s", option: "%o"', title, desp, option)
        // !由于 OneBot 的 option 中带有必填项，所以需要校验
        // 根据 optionSchema 验证 option
        validate(option, OneBot.optionSchema as OptionSchema<OneBotOption>)
        if (option.message_type === 'private' && !option.user_id) {
            throw new Error('OneBot 私聊消息类型必须提供 user_id')
        }
        if (option.message_type === 'group' && !option.group_id) {
            throw new Error('OneBot 群聊消息类型必须提供 group_id')
        }
        const { message_type = 'private', ...args } = option || {}
        const message = `${title}${desp ? `\n${desp}` : ''}`
        return ajax<OneBotResponse>({
            baseURL: this.ONE_BOT_BASE_URL,
            url: '/send_msg',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.ONE_BOT_ACCESS_TOKEN}`,
            },
            data: {
                auto_escape: false,
                message_type,
                message,
                ...args,
            },
        })
    }

}
