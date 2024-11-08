import debug from 'debug'
import { Send } from '../interfaces/send'
import { ajax } from '@/utils/ajax'
import { SendResponse } from '@/interfaces/response'

const Debugger = debug('push:telegram')

export interface TelegramOption {
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
     * 静默发送
     * 静默地发送消息。消息发布后用户会收到无声通知。
     * @author CaoMeiYouRen
     * @date 2023-10-22
     */
    TELEGRAM_SEND_SILENTLY?: boolean
    /**
     * 阻止转发/保存
     * 如果启用，Telegram 中的机器人消息将受到保护，不会被转发和保存。
     * @author CaoMeiYouRen
     * @date 2023-10-22
     */
    TELEGRAM_PROTECT_CONTENT?: boolean
    /**
     * 话题 ID
     * 可选的唯一标识符，用以向该标识符对应的话题发送消息，仅限启用了话题功能的超级群组可用
     * @author CaoMeiYouRen
     * @date 2023-10-22
     */
    TELEGRAM_MESSAGE_THREAD_ID?: string
}

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
    /**
     * 静默发送
     * 静默地发送消息。消息发布后用户会收到无声通知。
     * @author CaoMeiYouRen
     * @date 2023-10-22
     * @private
     */
    private TELEGRAM_SEND_SILENTLY?: boolean = false
    /**
     * 阻止转发/保存
     * 如果启用，Telegram 中的机器人消息将受到保护，不会被转发和保存。
     * @author CaoMeiYouRen
     * @date 2023-10-22
     * @private
     */
    private TELEGRAM_PROTECT_CONTENT?: boolean = false
    /**
     * 话题 ID
     * 可选的唯一标识符，用以向该标识符对应的话题发送消息，仅限启用了话题功能的超级群组可用
     * @author CaoMeiYouRen
     * @date 2023-10-22
     * @private
     */
    private TELEGRAM_MESSAGE_THREAD_ID?: string

    proxyUrl?: string

    constructor(option: TelegramOption) {
        Debugger('option: %O', option)
        Object.assign(this, option)
        if (!this.TELEGRAM_BOT_TOKEN) {
            throw new Error('TELEGRAM_BOT_TOKEN 是必须的！')
        }
        if (!this.TELEGRAM_CHAT_ID) {
            throw new Error('TELEGRAM_CHAT_ID 是必须的！')
        }
    }

    async send(text: string): Promise<SendResponse<TelegramResponse>> {
        const url = `https://api.telegram.org/bot${this.TELEGRAM_BOT_TOKEN}/sendMessage`
        Debugger('text: %s, url: %s', text, url)
        return ajax<TelegramResponse>({
            url,
            method: 'POST',
            proxyUrl: this.proxyUrl,
            data: {
                chat_id: this.TELEGRAM_CHAT_ID,
                text,
                disable_notification: this.TELEGRAM_SEND_SILENTLY,
                protect_content: this.TELEGRAM_PROTECT_CONTENT,
                message_thread_id: this.TELEGRAM_MESSAGE_THREAD_ID,
            },
        })
    }
}
