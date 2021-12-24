import { AxiosResponse } from 'axios'
import debug from 'debug'
import { Send } from '../interfaces/send'
import { ajax } from '@/utils/ajax'

const Debugger = debug('push:push-plus')

export type TemplateType = 'html' | 'txt' | 'json' | 'markdown' | 'cloudMonitor' | 'jenkins' | 'route'

export type ChannelType = 'wechat' | 'webhook' | 'cp' | 'sms' | 'mail'

/**
 * pushplus 推送加开放平台，仅支持一对一推送。官方文档：https://www.pushplus.plus/doc/
 *
 * @author CaoMeiYouRen
 * @date 2021-03-03
 * @export
 * @class PushPlus
 */
export class PushPlus implements Send {

    /**
     * 请前往 https://www.pushplus.plus/message 领取
     *
     * @private
     */
    private PUSH_PLUS_TOKEN: string
    /**
     *
     * @author CaoMeiYouRen
     * @date 2021-03-03
     * @param PUSH_PLUS_TOKEN 请前往 https://www.pushplus.plus/message 领取
     */
    constructor(PUSH_PLUS_TOKEN: string) {
        this.PUSH_PLUS_TOKEN = PUSH_PLUS_TOKEN
        Debugger('set PUSH_PLUS_TOKEN: "%s"', PUSH_PLUS_TOKEN)
        if (!this.PUSH_PLUS_TOKEN) {
            throw new Error('PUSH_PLUS_TOKEN 是必须的！')
        }
    }
    /**
     *
     *
     * @author CaoMeiYouRen
     * @date 2021-06-06
     * @param title
     * @param [content] 消息标题
     * @param [template='html'] 具体消息内容，根据不同template支持不同格式
     * @param [channel='wechat'] 发送渠道
     * @returns
     */
    send(title: string, content?: string, template: TemplateType = 'html', channel: ChannelType = 'wechat'): Promise<AxiosResponse<any>> {
        Debugger('title: "%s", content: "%s", template: "%s"', title, content, template)
        return ajax({
            url: 'http://www.pushplus.plus/send',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            data: {
                token: this.PUSH_PLUS_TOKEN,
                title,
                content: content || title,
                template,
                channel,
            },
        })
    }

}
