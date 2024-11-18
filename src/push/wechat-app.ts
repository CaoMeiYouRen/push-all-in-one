import debug from 'debug'
import { Send } from '@/interfaces/send'
import { warn } from '@/utils/helper'
import { ajax } from '@/utils/ajax'
import { SendResponse } from '@/interfaces/response'
import { ConfigSchema, OptionSchema } from '@/interfaces/schema'
import { validate } from '@/utils/validate'

const Debugger = debug('push:wechat-app')
export type WechatAppMsgType = 'text' | 'markdown' | 'voice' | 'file' | 'image' | 'voice' | 'video' | 'textcard' | 'news' | 'mpnews' | 'miniprogram_notice' | 'template_card'
export interface WechatAppConfig {
    /**
     * 企业ID，获取方式参考：[术语说明-corpid](https://work.weixin.qq.com/api/doc/90000/90135/91039#14953/corpid)
     *
     */
    WECHAT_APP_CORPID: string
    /**
     * 应用的凭证密钥，获取方式参考：[术语说明-secret](https://work.weixin.qq.com/api/doc/90000/90135/91039#14953/secret)
     *
     */
    WECHAT_APP_SECRET: string
    /**
     * 企业应用的id。企业内部开发，可在应用的设置页面查看
     *
     */
    WECHAT_APP_AGENTID: number
}

export type WechatAppConfigSchema = ConfigSchema<WechatAppConfig>

export const wechatAppConfigSchema: WechatAppConfigSchema = {
    WECHAT_APP_CORPID: {
        type: 'string',
        title: '企业ID',
        description: '企业ID，获取方式参考：[术语说明-corpid](https://work.weixin.qq.com/api/doc/90000/90135/91039#14953/corpid)',
        required: true,
    },
    WECHAT_APP_SECRET: {
        type: 'string',
        title: '应用的凭证密钥',
        description: '应用的凭证密钥，获取方式参考：[术语说明-secret](https://work.weixin.qq.com/api/doc/90000/90135/91039#14953/secret)',
        required: true,
    },
    WECHAT_APP_AGENTID: {
        type: 'number',
        title: '企业应用的id',
        description: '企业应用的id。企业内部开发，可在应用的设置页面查看',
        required: true,
    },
} as const

export type WechatAppOption = {
    // 消息类型
    msgtype: WechatAppMsgType
    // 表示是否是保密消息，0表示可对外分享，1表示不能，默认0。
    safe?: 0 | 1
    // 表示是否开启id转译，0表示否，1表示是，默认0。
    enable_id_trans?: 0 | 1
    // 表示是否开启重复消息检查，0表示否，1表示是，默认0
    enable_duplicate_check?: 0 | 1
    // 表示是否重复消息检查的时间间隔，默认1800s，最大不超过4小时
    duplicate_check_interval?: number
    [key: string]: any
    // 指定接收消息的成员，成员ID列表（多个接收者用‘|’分隔，最多支持1000个）。
    // 特殊情况：指定为"@all"，则向该企业应用的全部成员发送
    touser?: string
} & ({
    // 指定接收消息的部门，部门ID列表，多个接收者用‘|’分隔，最多支持100个。
    // 当touser为"@all"时忽略本参数
    toparty?: string
} | {
    // 指定接收消息的标签，标签ID列表，多个接收者用‘|’分隔，最多支持100个。
    // 当touser为"@all"时忽略本参数
    totag?: string
})

export type WechatAppOptionSchema = OptionSchema<WechatAppOption>
export const wechatAppOptionSchema: WechatAppOptionSchema = {
    msgtype: {
        type: 'select',
        title: '消息类型',
        description: '消息类型',
        required: true,
        options: [
            {
                label: '文本',
                value: 'text',
            },
            {
                label: 'Markdown',
                value: 'markdown',
            },
            {
                label: '语音',
                value: 'voice',
            },
            {
                label: '文件',
                value: 'file',
            },
            {
                label: '图片',
                value: 'image',
            },
            {
                label: '视频',
                value: 'video',
            },
            {
                label: '图文',
                value: 'news',
            },
            {
                label: '小程序通知',
                value: 'miniprogram_notice',
            },
            {
                label: '模板卡片',
                value: 'template_card',
            },
        ],
    },
    safe: {
        type: 'select',
        title: '是否是保密消息',
        description: '表示是否是保密消息，0表示可对外分享，1表示不能',
        required: false,
        options: [
            {
                label: '否',
                value: 0,
            },
            {
                label: '是',
                value: 1,
            },
        ],
    },
    enable_id_trans: {
        type: 'select',
        title: '是否开启id转译',
        description: '表示是否开启id转译，0表示否，1表示是，默认0。',
        required: false,
        options: [
            {
                label: '否',
                value: 0,
            },
            {
                label: '是',
                value: 1,
            },
        ],
    },
    enable_duplicate_check: {
        type: 'select',
        title: '是否开启重复消息检查',
        description: '表示是否开启重复消息检查，0表示否，1表示是，默认',
        required: false,
        options: [
            {
                label: '否',
                value: 0,
            },
            {
                label: '是',
                value: 1,
            },
        ],
    },
    duplicate_check_interval: {
        type: 'number',
        title: '重复消息检查的时间间隔',
        description: '表示是否重复消息检查的时间间隔，默认1800s，最大不超过4小时',
        required: false,
    },
    touser: {
        type: 'string',
        title: '指定接收消息的成员',
        description: '指定接收消息的成员，成员ID列表（多个接收者用‘|’分隔，最多支持1000个）。',
        required: false,
    },
    toparty: {
        type: 'string',
        title: '指定接收消息的部门',
        description: '指定接收消息的部门，部门ID列表，多个接收者用‘|’分隔，最多支持100个。',
        required: false,
    },
    totag: {
        type: 'string',
        title: '指定接收消息的标签',
        description: '指定接收消息的标签，标签ID列表，多个接收者用‘|’分隔，最多支持100个。',
        required: false,
    },
} as const

export interface WechatAppResponse {
    // 企业微信返回的错误码，为0表示成功，非0表示调用失败
    errcode: number
    errmsg: string
    invaliduser?: string
    invalidparty?: string
    invalidtag?: string
    unlicenseduser?: string
    msgid: string
    response_code?: string
}
/**
 * 企业微信应用推送，文档：https://developer.work.weixin.qq.com/document/path/90664
 *
 * @author CaoMeiYouRen
 * @date 2021-02-28
 * @export
 * @class WechatApp
 */
export class WechatApp implements Send {

    static readonly namespace = '企业微信应用'
    static readonly configSchema = wechatAppConfigSchema
    static readonly optionSchema = wechatAppOptionSchema

    private ACCESS_TOKEN: string

    private WECHAT_APP_CORPID: string
    private WECHAT_APP_SECRET: string
    private WECHAT_APP_AGENTID: number

    /**
     * ACCESS_TOKEN 的过期时间(时间戳)
     *
     * @private
     */
    private expiresTime: number

    constructor(config: WechatAppConfig) {
        Debugger('config: %O', config)
        Object.assign(this, config)
        // 根据 configSchema 验证 config
        validate(config, WechatApp.configSchema)
    }

    private async getAccessToken(): Promise<string> {
        const { data } = await ajax({
            url: 'https://qyapi.weixin.qq.com/cgi-bin/gettoken',
            query: {
                corpid: this.WECHAT_APP_CORPID,
                corpsecret: this.WECHAT_APP_SECRET,
            },
        })
        if (data?.errcode !== 0) { // 出错返回码，为0表示成功，非0表示调用失败
            throw new Error(data?.errmsg || '获取 access_token 失败！')
        }
        const { access_token, expires_in = 7200 } = data
        Debugger('获取 access_token 成功: %s', access_token)
        this.extendexpiresTime(expires_in)
        return access_token
    }
    /**
     * 延长过期时间
     *
     * @author CaoMeiYouRen
     * @date 2021-03-03
     * @private
     * @param expiresIn 延长的秒数
     */
    private extendexpiresTime(expiresIn: number): void {
        this.expiresTime = Date.now() + expiresIn * 1000 // 设置过期时间
    }

    /**
     * 发送消息
     *
     * @author CaoMeiYouRen
     * @date 2024-11-08
     * @param title 消息标题
     * @param [desp] 消息内容，最长不超过2048个字节，超过将截断（支持id转译）
     * @param [option] 额外推送选项
     */
    async send(title: string, desp?: string, option?: WechatAppOption): Promise<SendResponse<WechatAppResponse>> {
        Debugger('title: "%s", desp: "%s", option: %O', title, desp, option)
        if (!this.ACCESS_TOKEN || Date.now() >= this.expiresTime) {
            this.ACCESS_TOKEN = await this.getAccessToken()
        }
        const { msgtype = 'text', touser: _touser, ...args } = option || {}
        if (!_touser) {
            warn('未指定 touser，将使用 "@all" 向全体成员推送')
        }
        const sep = msgtype === 'markdown' ? '\n\n' : '\n'
        const content = `${title}${desp ? `${sep}${desp}` : ''}`
        const touser = _touser || '@all' // 如果没有指定 touser，则使用全体成员
        return ajax({
            url: 'https://qyapi.weixin.qq.com/cgi-bin/message/send',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            query: {
                access_token: this.ACCESS_TOKEN,
            },
            data: {
                touser,
                msgtype,
                agentid: this.WECHAT_APP_AGENTID,
                [msgtype]: {
                    content,
                },
                ...args,
            },
        })
    }
}
