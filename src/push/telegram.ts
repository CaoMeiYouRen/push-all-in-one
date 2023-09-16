import { AxiosResponse } from 'axios'
import debug from 'debug'
import { Send } from '../interfaces/send'
import { ajax } from '@/utils/ajax'

const Debugger = debug('push:telegram')

export type TelegramOption = {
    TELEGRAM_BOT_TOKEN: string
    TELEGRAM_CHAT_ID: string
    TELEGRAM_SEND_SILENTLY?: boolean
    TELEGRAM_PROTECT_CONTENT?: boolean
    TELEGRAM_MESSAGE_THREAD_ID?: string
}
/**
 *  Telegram Bot 推送
 *
 * @author CaoMeiYouRen
 * @date 2023-09-16
 * @export
 * @class Telegram
 */
export class Telegram implements Send {

    TELEGRAM_BOT_TOKEN: string
    TELEGRAM_CHAT_ID: string
    TELEGRAM_SEND_SILENTLY?: boolean = false
    TELEGRAM_PROTECT_CONTENT?: boolean = false
    TELEGRAM_MESSAGE_THREAD_ID?: string

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

    async send(text: string): Promise<AxiosResponse<any>> {
        const url = `https://api.telegram.org/bot${this.TELEGRAM_BOT_TOKEN}/sendMessage`
        return ajax({
            url,
            query: {
                chat_id: this.TELEGRAM_CHAT_ID,
                text,
                disable_notification: this.TELEGRAM_SEND_SILENTLY,
                protect_content: this.TELEGRAM_PROTECT_CONTENT,
                message_thread_id: this.TELEGRAM_MESSAGE_THREAD_ID,
            },
        })
    }
}
