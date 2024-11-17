import debug from 'debug'
import { Send } from '@/interfaces/send'
import { ajax } from '@/utils/ajax'
import { SendResponse } from '@/interfaces/response'
import { ConfigSchema, OptionSchema } from '@/interfaces/schema'
import { validate } from '@/utils/validate'

const Debugger = debug('push:telegram')

export interface TelegramConfig {
    /**
     * 机器人令牌
     * 您可以从 https://t.me/BotFather 获取 Token。
     * @author CaoMeiYouRen
     * @date 2023-10-22
     */
    TELEGRAM_BOT_TOKEN: string
    /**
     * 支持对话/群组/频道的 Chat ID
     * 您可以转发消息到 https://t.me/JsonDumpBot 获取 Chat ID
     * @author CaoMeiYouRen
     * @date 2023-10-22
     */
    TELEGRAM_CHAT_ID: number
    /**
     * 代理地址
     */
    PROXY_URL?: string
}

export type TelegramConfigSchema = ConfigSchema<TelegramConfig>
export const telegramConfigSchema: TelegramConfigSchema = {
    TELEGRAM_BOT_TOKEN: {
        type: 'string',
        title: '机器人令牌',
        description: '您可以从 https://t.me/BotFather 获取 Token。',
        required: true,
    },
    TELEGRAM_CHAT_ID: {
        type: 'number',
        title: '支持对话/群组/频道的 Chat ID',
        description: '您可以转发消息到 https://t.me/JsonDumpBot 获取 Chat ID',
        required: true,
    },
    PROXY_URL: {
        type: 'string',
        title: '代理地址',
        description: '代理地址',
        required: false,
    },
} as const

/**
 * 参考 https://core.telegram.org/bots/api#sendmessage
 *
 * @author CaoMeiYouRen
 * @date 2024-11-09
 * @export
 * @interface TelegramOption
 */
export interface TelegramOption {
    /**
     * 静默发送
     * 静默地发送消息。消息发布后用户会收到无声通知。
     */
    disable_notification?: boolean
    /**
     * 阻止转发/保存
     * 如果启用，Telegram 中的机器人消息将受到保护，不会被转发和保存。
     */
    protect_content?: boolean
    /**
     * 话题 ID
     * 可选的唯一标识符，用以向该标识符对应的话题发送消息，仅限启用了话题功能的超级群组可用
     */
    message_thread_id?: string
    // [key: string]: any
}

export type TelegramOptionSchema = OptionSchema<TelegramOption>

export const telegramOptionSchema: TelegramOptionSchema = {
    disable_notification: {
        type: 'boolean',
        title: '静默发送',
        description: '静默地发送消息。消息发布后用户会收到无声通知。',
        required: false,
    },
    protect_content: {
        type: 'boolean',
        title: '阻止转发/保存',
        description: '如果启用，Telegram 中的机器人消息将受到保护，不会被转发和保存。',
        required: false,
    },
    message_thread_id: {
        type: 'string',
        title: '话题 ID',
        description: '可选的唯一标识符，用以向该标识符对应的话题发送消息，仅限启用了话题功能的超级群组可用',
        required: false,
    },
} as const

interface From {
    id: number
    is_bot: boolean
    first_name: string
    username: string
}
interface Chat {
    id: number
    first_name: string
    last_name: string
    username: string
    type: string
}
interface Result {
    message_id: number
    from: From
    chat: Chat
    date: number
    text: string
}
export interface TelegramResponse {
    ok: boolean
    result: Result
}

/**
 *  Telegram Bot 推送。
 *  官方文档：https://core.telegram.org/bots/api#making-requests
 *
 * @author CaoMeiYouRen
 * @date 2023-09-16
 * @export
 * @class Telegram
 */
export class Telegram implements Send {

    static configSchema = telegramConfigSchema
    static optionSchema = telegramOptionSchema

    /**
     * 机器人令牌
     * 您可以从 https://t.me/BotFather 获取 Token。
     * @author CaoMeiYouRen
     * @date 2023-10-22
     * @private
     */
    private TELEGRAM_BOT_TOKEN: string
    /**
     * 支持对话/群组/频道的 Chat ID
     * 您可以转发消息到 https://t.me/JsonDumpBot 获取 Chat ID
     * @author CaoMeiYouRen
     * @date 2023-10-22
     * @private
     */
    private TELEGRAM_CHAT_ID: number

    proxyUrl?: string

    constructor(config: TelegramConfig) {
        Debugger('config: %O', config)
        Object.assign(this, config)
        // 根据 configSchema 验证 config
        validate(config, Telegram.configSchema)
        if (config.PROXY_URL) {
            this.proxyUrl = config.PROXY_URL
        }
    }

    /**
     * 发送消息
     *
     * @author CaoMeiYouRen
     * @date 2024-11-09
     * @param title 消息标题
     * @param [desp] 消息正文，和 title 相加后不超过 4096 个字符
     * @param [option] 其他参数
     */
    async send(title: string, desp?: string, option?: TelegramOption): Promise<SendResponse<TelegramResponse>> {
        const url = `https://api.telegram.org/bot${this.TELEGRAM_BOT_TOKEN}/sendMessage`
        Debugger('title: "%s", desp: "%s", option: %O', title, desp, option)
        const text = `${title}${desp ? `\n${desp}` : ''}`
        return ajax<TelegramResponse>({
            url,
            method: 'POST',
            proxyUrl: this.proxyUrl,
            data: {
                chat_id: this.TELEGRAM_CHAT_ID,
                text,
            },
        })
    }
}
