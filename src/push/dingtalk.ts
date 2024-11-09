import { AxiosResponse } from 'axios'
import debug from 'debug'
import { Markdown } from './dingtalk/markdown'
import { Text } from './dingtalk/text'
import { Link } from './dingtalk/link'
import { FeedCard } from './dingtalk/feed-card'
import { ActionCard } from './dingtalk/action-card'
import { Send } from '@/interfaces/send'
import { warn } from '@/utils/helper'
import { ajax } from '@/utils/ajax'
import { generateSignature } from '@/utils/crypto'
import { SendResponse } from '@/interfaces/response'

const Debugger = debug('push:dingtalk')

export type DingtalkMsgType = 'text' | 'markdown' | 'link' | 'actionCard' | 'feedCard'

export interface DingtalkConfig {
    /**
     * 钉钉机器人 access_token。官方文档：https://developers.dingtalk.com/document/app/custom-robot-access
     */
    DINGTALK_ACCESS_TOKEN: string
    /**
     * 加签安全秘钥（HmacSHA256）
     */
    DINGTALK_SECRET?: string
}

export type DingtalkOption = {
    [key: string]: any
} & Partial<(Text | Markdown | Link | FeedCard | ActionCard)>

export interface DingtalkResponse {
    errcode: number
    errmsg: string
}

/**
 * 钉钉机器人推送
 * 在 [dingtalk-robot-sdk](https://github.com/ineo6/dingtalk-robot-sdk) 的基础上重构了一下，用法几乎完全一致。
 * @author CaoMeiYouRen
 * @date 2021-02-27
 * @export
 * @class Dingtalk
 */
export class Dingtalk implements Send {
    private ACCESS_TOKEN: string
    /**
     * 加签安全秘钥（HmacSHA256）
     *
     * @private
     */
    private SECRET?: string
    private webhook: string = 'https://oapi.dingtalk.com/robot/send'

    /**
     * 参考文档 [钉钉开放平台 - 自定义机器人接入](https://developers.dingtalk.com/document/app/custom-robot-access)
     * @author CaoMeiYouRen
     * @date 2024-11-08
     * @param config
     */
    constructor(config: DingtalkConfig) {
        const { DINGTALK_ACCESS_TOKEN, DINGTALK_SECRET } = config
        this.ACCESS_TOKEN = DINGTALK_ACCESS_TOKEN
        this.SECRET = DINGTALK_SECRET
        Debugger('DINGTALK_ACCESS_TOKEN: %s , DINGTALK_SECRET: %s', this.ACCESS_TOKEN, this.SECRET)
        if (!this.ACCESS_TOKEN) {
            throw new Error('ACCESS_TOKEN 是必须的！')
        }
        if (!this.SECRET) {
            warn('未提供 SECRET ！')
        }
    }

    private getSign(timeStamp: number): string {
        let signStr = ''
        if (this.SECRET) {
            signStr = generateSignature(timeStamp, this.SECRET, this.SECRET)
            Debugger('Sign string is %s, result is %s', `${timeStamp}\n${this.SECRET}`, signStr)
        }
        return signStr
    }

    private async push(data: DingtalkOption): Promise<AxiosResponse<DingtalkResponse>> {
        const timestamp = Date.now()
        const sign = this.getSign(timestamp)
        const result = await ajax({
            url: this.webhook,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            query: {
                timestamp,
                sign,
                access_token: this.ACCESS_TOKEN,
            },
            data,
        })
        Debugger('Result is %s, %s。', result.data.errcode, result.data.errmsg)
        if (result.data.errcode === 310000) {
            console.error('Send Failed:', result.data)
            Debugger('Please check safe config : %O', result.data)
        }
        return result
    }

    /**
     *
     *
     * @author CaoMeiYouRen
     * @date 2024-11-08
     * @param title 消息的标题
     * @param [desp] 消息的内容，支持 Markdown
     * @returns
     */
    async send(title: string, desp?: string, option?: DingtalkOption): Promise<SendResponse<DingtalkResponse>> {
        Debugger('title: "%s", desp: "%s", option: %O', title, desp, option)
        switch (option.msgtype) {
            case 'text':
                return this.push({
                    msgtype: 'text',
                    text: {
                        content: `${title}${desp ? `\n${desp}` : ''}`,
                    },
                    ...option,
                })
            case 'markdown':
                return this.push({
                    msgtype: 'markdown',
                    markdown: {
                        title,
                        text: `# ${title}${desp ? `\n\n${desp}` : ''}`,
                    },
                    ...option,
                })
            case 'link':
                return this.push({
                    msgtype: 'link',
                    link: {
                        title,
                        text: desp || '',
                        picUrl: option?.link?.picUrl || '',
                        messageUrl: option.link?.messageUrl || '',
                    },
                    ...option,
                })
            case 'actionCard':
                return this.push({
                    msgtype: 'actionCard',
                    actionCard: {
                        title,
                        text: desp || '',
                        btnOrientation: option?.actionCard?.btnOrientation || '0',
                        btns: (option?.actionCard as any)?.btns,
                        singleTitle: (option?.actionCard as any)?.singleTitle,
                        singleURL: (option?.actionCard as any)?.singleURL,
                    },
                    ...option,
                })
            case 'feedCard':
                return this.push({
                    msgtype: 'feedCard',
                    feedCard: {
                        links: option?.feedCard?.links || [],
                    },
                    ...option,
                })
            default:
                throw new Error('msgtype is required!')
        }
    }
}
