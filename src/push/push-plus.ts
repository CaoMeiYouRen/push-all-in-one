import { ajax } from '@/utils/ajax'
import { AxiosResponse } from 'axios'
import debug from 'debug'
import { Send } from '../interfaces/send'

const Debugger = debug('push:push-plus')

type TemplateType = 'html' | 'json' | 'cloudMonitor'
/**
 * pushplus 推送加开放平台，仅支持一对一推送。官方文档：http://pushplus.hxtrip.com/doc/
 *
 * @author CaoMeiYouRen
 * @date 2021-03-03
 * @export
 * @class PushPlus
 */
export class PushPlus implements Send {

    /**
     * 请前往 http://pushplus.hxtrip.com/message 领取
     *
     * @private
     */
    private PUSH_PLUS_TOKEN: string
    /**
     *
     * @author CaoMeiYouRen
     * @date 2021-03-03
     * @param PUSH_PLUS_TOKEN 请前往 http://pushplus.hxtrip.com/message 领取
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
     * @date 2021-03-03
     * @param title 消息标题
     * @param [content] 具体消息内容，根据不同template支持不同格式
     * @param [template='html'] 发送消息模板，默认为 html
     * @returns
     */
    send(title: string, content?: string, template: TemplateType = 'html'): Promise<AxiosResponse<any>> {
        Debugger('title: "%s", content: "%s", template: "%s"', title, content, template)
        return ajax({
            url: 'http://pushplus.hxtrip.com/send',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            data: {
                token: this.PUSH_PLUS_TOKEN,
                title,
                content: content || title,
                template,
            },
        })
    }

}
