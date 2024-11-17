import debug from 'debug'
import { Send } from '@/interfaces/send'
import { ajax } from '@/utils/ajax'
import { SendResponse } from '@/interfaces/response'
import { ConfigSchema, OptionSchema } from '@/interfaces/schema'
import { validate } from '@/utils/validate'

const Debugger = debug('push:push-plus')
/**
html	默认模板，支持html文本
txt	纯文本展示，不转义html
json	内容基于json格式展示
markdown	内容基于markdown格式展示
cloudMonitor	阿里云监控报警定制模板
jenkins	jenkins插件定制模板
route	路由器插件定制模板 */
export type PushPlusTemplateType = 'html' | 'txt' | 'json' | 'markdown' | 'cloudMonitor' | 'jenkins' | 'route'
/**
wechat	免费	微信公众号
webhook	免费	第三方webhook；企业微信、钉钉、飞书、server酱；webhook机器人推送
cp	免费	企业微信应用；具体参考企业微信应用推送
mail	免费	邮箱；具体参考邮件渠道使用说明
sms	收费	短信，未开放
 */
export type PushPlusChannelType = 'wechat' | 'webhook' | 'cp' | 'sms' | 'mail'

export interface PushPlusConfig {
    /**
     *  请前往 https://www.pushplus.plus 领取
     */
    PUSH_PLUS_TOKEN: string
}

export type PushPlusConfigSchema = ConfigSchema<PushPlusConfig>

export const pushPlusConfigSchema: PushPlusConfigSchema = {
    PUSH_PLUS_TOKEN: {
        type: 'string',
        title: 'PushPlus Token',
        description: '请前往 https://www.pushplus.plus/ 领取',
        required: true,
    },
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

export type PushPlusOptionSchema = OptionSchema<PushPlusOption>

export const pushPlusOptionSchema: PushPlusOptionSchema = {
    template: {
        type: 'select',
        title: '模板类型',
        description: 'html，txt，json，markdown，cloudMonitor，jenkins，route',
        required: false,
        default: 'html',
        options: [
            {
                label: 'HTML',
                value: 'html',
            },
            {
                label: '文本',
                value: 'txt',
            },
            {
                label: 'JSON',
                value: 'json',
            },
            {
                label: 'Markdown',
                value: 'markdown',
            },
            {
                label: '阿里云监控',
                value: 'cloudMonitor',
            },
            {
                label: 'Jenkins',
                value: 'jenkins',
            },
            {
                label: '路由器',
                value: 'route',
            },
        ],
    },
    channel: {
        type: 'select',
        title: '渠道类型',
        description: 'wechat，webhook，cp，sms，mail',
        required: false,
        default: 'wechat',
        options: [
            {
                label: '微信',
                value: 'wechat',
            },
            {
                label: 'Webhook',
                value: 'webhook',
            },
            {
                label: '企业微信',
                value: 'cp',
            },
            {
                label: '邮件',
                value: 'mail',
            },
            {
                label: '短信',
                value: 'sms',
            },
        ],
    },
    topic: {
        type: 'string',
        title: '群组编码',
        description: '不填仅发送给自己；channel为webhook时无效',
        required: false,
        default: '',
    },
    webhook: {
        type: 'string',
        title: 'webhook编码',
        description: '仅在channel使用webhook渠道和CP渠道时需要填写',
        required: false,
        default: '',
    },
    callbackUrl: {
        type: 'string',
        title: '发送结果回调地址',
        description: '发送结果回调地址',
        required: false,
        default: '',
    },
    timestamp: {
        type: 'number',
        title: '毫秒时间戳',
        description: '格式如：1632993318000。服务器时间戳大于此时间戳，则消息不会发送',
        required: false,
        default: 0,
    },
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
    static configSchema = pushPlusConfigSchema
    static optionSchema = pushPlusOptionSchema
    /**
     * 请前往 https://www.pushplus.plus 领取
     *
     * @private
     */
    private PUSH_PLUS_TOKEN: string

    /**
     *
     * @author CaoMeiYouRen
     * @date 2024-11-08
     * @param config 请前往 https://www.pushplus.plus 领取
     */
    constructor(config: PushPlusConfig) {
        const { PUSH_PLUS_TOKEN } = config
        this.PUSH_PLUS_TOKEN = PUSH_PLUS_TOKEN
        Debugger('set PUSH_PLUS_TOKEN: "%s"', PUSH_PLUS_TOKEN)
        // 根据 configSchema 验证 config
        validate(config, PushPlus.configSchema)
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
