import { AxiosResponse } from 'axios'
import debug from 'debug'
import { Send } from '@/interfaces/send'
import { ajax } from '@/utils/ajax'
import { warn } from '@/utils/helper'

const Debugger = debug('push:one-bot')

export type OneBotMsgType = 'private' | 'group'

export interface OneBotData {
    ClassType: string
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
     * Creates an instance of OneBot.
     * @author CaoMeiYouRen
     * @date 2023-10-22
     * @param ONE_BOT_BASE_URL OneBot HTTP 基础路径
     * @param [ONE_BOT_ACCESS_TOKEN] 出于安全原因，请务必设置 AccessToken
     *
     */
    constructor(ONE_BOT_BASE_URL: string, ONE_BOT_ACCESS_TOKEN?: string) {
        this.ONE_BOT_BASE_URL = ONE_BOT_BASE_URL
        this.ONE_BOT_ACCESS_TOKEN = ONE_BOT_ACCESS_TOKEN
        Debugger('set ONE_BOT_BASE_URL: "%s", ONE_BOT_ACCESS_TOKEN: "%s"', ONE_BOT_BASE_URL, ONE_BOT_ACCESS_TOKEN)
        if (!this.ONE_BOT_BASE_URL) {
            throw new Error('ONE_BOT_BASE_URL 是必须的！')
        }
        if (!this.ONE_BOT_ACCESS_TOKEN) {
            warn('未提供 ONE_BOT_ACCESS_TOKEN ！出于安全原因，请务必设置 AccessToken！')
        }
    }

    /**
     *
     * @author CaoMeiYouRen
     * @date 2023-10-22
     * @param message 要发送的消息
     * @param msgType 消息类型
     * @param recieverId 用户/群组 ID，即 QQ 号或群号
     */
    async send(message: string, msgType: OneBotMsgType, recieverId: number): Promise<AxiosResponse<OneBotResponse>> {
        Debugger('message: "%s", msgType: "%s", recieverId: "%s"', message, msgType, recieverId)
        return ajax<OneBotResponse>({
            baseURL: this.ONE_BOT_BASE_URL,
            url: '/send_msg',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.ONE_BOT_ACCESS_TOKEN}`,
            },
            data: {
                auto_escape: true,
                message_type: msgType,
                message,
                group_id: msgType === 'group' ? recieverId : '',
                user_id: msgType === 'private' ? recieverId : '',
            },
        })
    }

}
