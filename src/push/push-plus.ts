import debug from 'debug'
import { Send } from '@/interfaces/send'
import { ajax } from '@/utils/ajax'
import { SendResponse } from '@/interfaces/response'

const Debugger = debug('push:push-plus')

export type PushPlusTemplateType = 'html' | 'txt' | 'json' | 'markdown' | 'cloudMonitor' | 'jenkins' | 'route'

export type PushPlusChannelType = 'wechat' | 'webhook' | 'cp' | 'sms' | 'mail'

export interface PushPlusConfig {
    /**
     *  请前往 https://www.pushplus.plus/message 领取
     */
    PUSH_PLUS_TOKEN: string
}

export interface PushPlusOption {
    /**
     * 模板类型
     */
    template?: PushPlusTemplateType
    /**
     * 渠道类型
     */
    channel?: PushPlusChannelType
    /**
     * 群组编码，不填仅发送给自己；channel为webhook时无效
     */
    topic?: string
    /**
     * webhook编码，仅在channel使用webhook渠道和CP渠道时需要填写
     */
    webhook?: string
    /**
     * 发送结果回调地址
     */
    callbackUrl?: string
    /**
     * 毫秒时间戳。格式如：1632993318000。服务器时间戳大于此时间戳，则消息不会发送
     */
    timestamp?: number
}

export interface PushPlusResponse {
    // 200 为正确
    code: number
    msg: string
    data: any
}

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
     * @date 2024-11-08
     * @param config 请前往 https://www.pushplus.plus/message 领取
     */
    constructor(config: PushPlusConfig) {
        const { PUSH_PLUS_TOKEN } = config
        this.PUSH_PLUS_TOKEN = PUSH_PLUS_TOKEN
        Debugger('set PUSH_PLUS_TOKEN: "%s"', PUSH_PLUS_TOKEN)
        if (!this.PUSH_PLUS_TOKEN) {
            throw new Error('PUSH_PLUS_TOKEN 是必须的！')
        }
    }

    /**
     * 发送消息
     *
     * @author CaoMeiYouRen
     * @date 2024-11-08
     * @param title 消息标题
     * @param [desp=''] 消息内容
     * @param [option] 额外推送选项
     */
    send(title: string, desp: string = '', option?: PushPlusOption): Promise<SendResponse<PushPlusResponse>> {
        Debugger('title: "%s", desp: "%s", option: "%o"', title, desp, option)
        const { template = 'html', channel = 'wechat', ...args } = option || {}
        const content = desp || title
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
                ...args,
            },
        })
    }

}
