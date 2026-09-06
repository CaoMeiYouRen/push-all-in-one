import debug from 'debug'
import { Send } from '@/interfaces/send'
import { ajax } from '@/utils/ajax'
import { SendResponse } from '@/interfaces/response'
import { ConfigSchema, OptionSchema } from '@/interfaces/schema'
import { validate } from '@/utils/validate'

const Debugger = debug('push:w-push')

/**
 * WPUSH 推送渠道
 * @see https://wpush.cn/docs
 */
export type WPushChannelType =
    | 'wechat'
    | 'app'
    | 'sms'
    | 'mail'
    | 'webhook'
    | 'dingtalk'
    | 'feishu'
    | 'wechat_work'
    | 'clawbot'
    | 'qqbot'

export interface WPushConfig {
    /**
     * WPUSH API Key，请前往 https://wpush.cn/settings 获取
     */
    WPUSH_APIKEY: string
}

export type WPushConfigSchema = ConfigSchema<WPushConfig>

export const wPushConfigSchema: WPushConfigSchema = {
    WPUSH_APIKEY: {
        type: 'string',
        title: 'WPUSH API Key',
        description: '请前往 https://wpush.cn/settings 获取，以 WPUSH 开头',
        required: true,
    },
}

export interface WPushOption {
    /**
     * 推送渠道，默认 wechat
     */
    channel?: WPushChannelType
    /**
     * 可选，Topic 广播编码
     */
    topic_code?: string
}

export type WPushOptionSchema = OptionSchema<WPushOption>

export const wPushOptionSchema: WPushOptionSchema = {
    channel: {
        type: 'select',
        title: '推送渠道',
        description: 'wechat / app / sms / mail / webhook / dingtalk / feishu / wechat_work / clawbot / qqbot',
        required: false,
        default: 'wechat',
        options: [
            { label: '微信公众号', value: 'wechat' },
            { label: 'App', value: 'app' },
            { label: '短信', value: 'sms' },
            { label: '邮件', value: 'mail' },
            { label: 'Webhook', value: 'webhook' },
            { label: '钉钉', value: 'dingtalk' },
            { label: '飞书', value: 'feishu' },
            { label: '企业微信', value: 'wechat_work' },
            { label: '微信 ClawBot', value: 'clawbot' },
            { label: 'QQ 机器人', value: 'qqbot' },
        ],
    },
    topic_code: {
        type: 'string',
        title: 'Topic 编码',
        description: '可选，Topic 广播编码；填写后按 Topic 推送，参考 https://wpush.cn/docs',
        required: false,
        default: '',
    },
}

export interface WPushResponse {
    // 0 为成功（注意：与 PushPlus 的 200 不同）
    code: number
    message?: string
    data?: any
}

/**
 * WPUSH 消息推送平台。官方文档：https://wpush.cn/docs
 *
 * 支持微信公众号 / App / 短信 / 邮件 / webhook / 钉钉 / 飞书 / 企微 / ClawBot 等渠道，
 * 以及 Topic 广播。成功时 JSON `code === 0`。
 *
 * @author Alone88
 * @date 2026-09-06
 * @export
 * @class WPush
 */
export class WPush implements Send {

    static readonly namespace = 'WPush'
    static readonly configSchema = wPushConfigSchema
    static readonly optionSchema = wPushOptionSchema

    /**
     * WPUSH API Key
     *
     * @private
     */
    private WPUSH_APIKEY: string

    /**
     * @param config 请前往 https://wpush.cn/settings 获取 API Key
     */
    constructor(config: WPushConfig) {
        const { WPUSH_APIKEY } = config
        this.WPUSH_APIKEY = WPUSH_APIKEY
        Debugger('set WPUSH_APIKEY: "%s"', WPUSH_APIKEY)
        validate(config, WPush.configSchema)
    }

    /**
     * 发送消息
     *
     * @param title 消息标题
     * @param [desp=''] 消息内容
     * @param [option] 额外推送选项
     */
    send(title: string, desp: string = '', option?: WPushOption): Promise<SendResponse<WPushResponse>> {
        Debugger('title: "%s", desp: "%s", option: "%o"', title, desp, option)
        const { channel = 'wechat', topic_code } = option || {}
        const content = desp || title
        const data: Record<string, string> = {
            apikey: this.WPUSH_APIKEY,
            title,
            content: content || title,
            channel,
        }
        if (topic_code) {
            data.topic_code = topic_code
        }
        return ajax({
            url: 'https://api.wpush.cn/api/v1/send',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            data,
        })
    }

}
