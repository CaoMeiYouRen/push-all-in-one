import debug from 'debug'
import { Send } from '@/interfaces/send'
import { ajax } from '@/utils/ajax'
import { SendResponse } from '@/interfaces/response'
import { ConfigSchema, OptionSchema } from '@/interfaces/schema'
import { validate } from '@/utils/validate'

const Debugger = debug('push:wx-pusher')

export interface WxPusherConfig {
    /**
     * WxPusher 的 appToken。在 https://wxpusher.zjiecode.com/admin/main/app/appToken 申请
     */
    WX_PUSHER_APP_TOKEN: string
    /**
     * WxPusher 的 uid。在 https://wxpusher.zjiecode.com/admin/main/wxuser/list 查看
     */
    WX_PUSHER_UID: string
}

export type WxPusherConfigSchema = ConfigSchema<WxPusherConfig>

export const wxPusherConfigSchema: WxPusherConfigSchema = {
    WX_PUSHER_APP_TOKEN: {
        type: 'string',
        title: 'appToken',
        description: '在 https://wxpusher.zjiecode.com/admin/main/app/appToken 申请',
        required: true,
    },
    WX_PUSHER_UID: {
        type: 'string',
        title: 'uid',
        description: '在 https://wxpusher.zjiecode.com/admin/main/wxuser/list 查看',
        required: true,
    },
} as const

export interface WxPusherOption {
    /**
     * 消息摘要，显示在微信聊天页面或者模版消息卡片上，限制长度20，可以不传，不传默认截取content前面的内容。
     */
    summary?: string
    /**
     * 内容类型 1表示文字  2表示html(只发送body标签内部的数据即可，不包括body标签) 3表示markdown
     * @default 1
     */
    contentType?: 1 | 2 | 3
    /**
     * 是否保存发送内容，1保存，0不保存
     * @default 0
     */
    save?: 0 | 1
    /**
     * 主题ID，可以根据主题ID发送消息，可以在主题管理中查看主题ID
     */
    topicIds?: number[]
    /**
     * 发送目标的UID，是一个数组。注意uids和topicIds可以同时填写，也可以只填写一个。
     */
    uids?: string[]
    /**
     * 发送url，可以不传，如果传了，则根据url弹出通知
     */
    url?: string
    /**
     * 验证负载，仅针对text消息类型有效
     */
    verifyPayload?: string
}

export type WxPusherOptionSchema = OptionSchema<WxPusherOption>

export const wxPusherOptionSchema: WxPusherOptionSchema = {
    summary: {
        type: 'string',
        title: '消息摘要',
        description: '显示在微信聊天页面或者模版消息卡片上，限制长度20，可以不传，不传默认截取content前面的内容。',
        required: false,
    },
    contentType: {
        type: 'select',
        title: '内容类型',
        description: '内容类型',
        required: false,
        default: 1,
        options: [
            {
                label: '文本',
                value: 1,
            },
            {
                label: 'HTML',
                value: 2,
            },
            {
                label: 'Markdown',
                value: 3,
            },
        ],
    },
    save: {
        type: 'select',
        title: '是否保存发送内容',
        description: '是否保存发送内容，1保存，0不保存，默认0',
        required: false,
        default: 0,
        options: [
            {
                label: '不保存',
                value: 0,
            },
            {
                label: '保存',
                value: 1,
            },
        ],
    },
    topicIds: {
        type: 'array',
        title: '主题ID',
        description: '主题ID，可以根据主题ID发送消息，可以在主题管理中查看主题ID',
        required: false,
    },
    uids: {
        type: 'array',
        title: '用户ID',
        description: '发送目标的UID，是一个数组。注意uids和topicIds可以同时填写，也可以只填写一个。',
        required: false,
    },
    url: {
        type: 'string',
        title: '发送url',
        description: '发送url，可以不传，如果传了，则根据url弹出通知',
        required: false,
    },
    verifyPayload: {
        type: 'string',
        title: '验证负载',
        description: '仅针对text消息类型有效',
        required: false,
    },
} as const

export interface WxPusherResponse {
    /**
     * 请求是否成功
     */
    success: boolean
    /**
     * 请求返回码
     */
    code: number
    /**
     * 请求返回消息
     */
    msg: string
    /**
     * 请求返回数据
     */
    data: {
        /**
         * 消息ID
         */
        messageId: number
        /**
         * 消息编码
         */
        code: string
    }
}

/**
 * WxPusher 推送。官方文档：https://wxpusher.zjiecode.com/docs
 *
 * @author CaoMeiYouRen
 * @date 2024-11-09
 * @export
 * @class WxPusher
 */
export class WxPusher implements Send {
    static readonly namespace = 'WxPusher'
    static readonly configSchema = wxPusherConfigSchema
    static readonly optionSchema = wxPusherOptionSchema

    private WX_PUSHER_APP_TOKEN: string
    private WX_PUSHER_UID: string

    constructor(config: WxPusherConfig) {
        const { WX_PUSHER_APP_TOKEN, WX_PUSHER_UID } = config
        this.WX_PUSHER_APP_TOKEN = WX_PUSHER_APP_TOKEN
        this.WX_PUSHER_UID = WX_PUSHER_UID
        Debugger('set WX_PUSHER_APP_TOKEN: "%s", WX_PUSHER_UID: "%s"', WX_PUSHER_APP_TOKEN, WX_PUSHER_UID)
        // 根据 configSchema 验证 config
        validate(config, WxPusher.configSchema)
    }

    async send(title: string, desp?: string, option?: WxPusherOption): Promise<SendResponse<WxPusherResponse>> {
        Debugger('title: "%s", desp: "%s", option: %O', title, desp, option)
        const { contentType = 1, uids = [this.WX_PUSHER_UID], ...args } = option || {}
        const content = `${title}${desp ? `\n${desp}` : ''}`
        return ajax({
            url: 'https://wxpusher.zjiecode.com/api/send/message',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            data: {
                appToken: this.WX_PUSHER_APP_TOKEN,
                content,
                contentType,
                uids,
                ...args,
            },
        })
    }
}
