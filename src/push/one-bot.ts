import debug from 'debug'
import { Send } from '@/interfaces/send'
import { ajax } from '@/utils/ajax'
import { warn } from '@/utils/helper'
import { SendResponse } from '@/interfaces/response'

const Debugger = debug('push:one-bot')

export type OneBotMsgType = 'private' | 'group'

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

export interface PrivateMsgOption {
    /**
     * 消息类型
     */
    message_type: 'private'
    /**
     * 对方 QQ 号
     */
    user_id: number
}

export interface GroupMsgOption {
    /**
     * 消息类型
     */
    message_type: 'group'
    /**
     * 群号
     */
    group_id: number

}

export type OneBotOption = (PrivateMsgOption | GroupMsgOption) & {
    /**
     * 消息内容是否作为纯文本发送（即不解析 CQ 码），只在 message 字段是字符串时有效
     */
    auto_escape?: boolean
}

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
    async send(title: string, desp?: string, option?: OneBotOption): Promise<SendResponse<OneBotResponse>> {
        Debugger('title: "%s", desp: "%s", option: "%o"', title, desp, option)
        const { message_type, ...args } = option || {}
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
