import { AxiosResponse } from 'axios'
import debug from 'debug'
import { Send } from '../interfaces/send'
import { MarkdownMsg } from './wechat/MarkdownMsg'
import { TextMsg } from './wechat/TextMsg'
import { ajax } from '@/utils/ajax'

const Debugger = debug('push:wechat-robot')

export type MsgType = 'text' | 'markdown'
type Msg = TextMsg | MarkdownMsg

/**
 * 企业微信群机器人。文档: [如何使用群机器人](https://work.weixin.qq.com/help?person_id=1&doc_id=13376)
 *
 * @author CaoMeiYouRen
 * @date 2021-02-28
 * @export
 * @class WechatRobot
 */
export class WechatRobot implements Send {

    private WX_ROBOT_KEY: string

    constructor(WX_ROBOT_KEY: string) {
        this.WX_ROBOT_KEY = WX_ROBOT_KEY
        Debugger('set WX_ROBOT_KEY: "%s"', WX_ROBOT_KEY)
        if (!this.WX_ROBOT_KEY) {
            throw new Error('WX_ROBOT_KEY 是必须的！')
        }
    }

    private async push(message: Msg): Promise<AxiosResponse<any>> {
        return ajax({
            url: 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send',
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
            query: { key: this.WX_ROBOT_KEY },
            data: { ...message },
        })
    }
    /**
     *
     *
     * @author CaoMeiYouRen
     * @date 2021-02-28
     * @param content 要发送的内容。text内容，最长不超过2048个字节；markdown内容，最长不超过4096个字节；必须是utf8编码
     * @param [msgtype='text'] 消息类型
     * @returns
     */
    async send(content: string, msgtype: MsgType = 'text'): Promise<AxiosResponse<any>> {
        Debugger('content: "%s", msgtype: "%s"', content, msgtype)
        switch (msgtype) {
            case 'text':
                return this.push(new TextMsg({
                    msgtype: 'text',
                    text: {
                        content,
                    },
                }))
            case 'markdown':
                return this.push(new MarkdownMsg({
                    msgtype: 'markdown',
                    markdown: {
                        content,
                    },
                }))
            default:
                break
        }
    }

}
