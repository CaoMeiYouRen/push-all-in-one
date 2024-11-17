import debug from 'debug'
import { Send } from '@/interfaces/send'
import { ajax } from '@/utils/ajax'
import { SendResponse } from '@/interfaces/response'
import { ConfigSchema, OptionSchema } from '@/interfaces/schema'
import { validate } from '@/utils/validate'

const Debugger = debug('push:push-deer')

export type PushDeerPushType = 'markdown' | 'text' | 'image'

export interface PushDeerConfig {
    /**
     * pushkey。请参考 https://github.com/easychen/pushdeer 获取
     */
    PUSH_DEER_PUSH_KEY: string

    /**
     * 使用自架版时的服务器端地址。例如 http://127.0.0.1:8800。默认为 https://api2.pushdeer.com
     */
    PUSH_DEER_ENDPOINT?: string
}

export type PushDeerConfigSchema = ConfigSchema<PushDeerConfig>

export const pushDeerConfigSchema: PushDeerConfigSchema = {
    PUSH_DEER_PUSH_KEY: {
        type: 'string',
        title: 'pushkey',
        description: '请参考 https://github.com/easychen/pushdeer 获取',
        required: true,
    },
    PUSH_DEER_ENDPOINT: {
        type: 'string',
        title: '使用自架版时的服务器端地址',
        description: '例如 http://127.0..1:8800。默认为 https://api2.pushdeer.com',
        required: false,
        default: 'https://api2.pushdeer.com',
    },
} as const

export interface PushDeerOption {
    /**
     * 格式。文本=text，markdown，图片=image，默认为markdown。type 为 image 时，text 中为要发送图片的URL
     */
    type?: PushDeerPushType
}

export type PushDeerOptionSchema = OptionSchema<PushDeerOption>
export const pushDeerOptionSchema: PushDeerOptionSchema = {
    type: {
        type: 'select',
        title: '格式',
        description: '文本=text，markdown，图片=image，默认为markdown。type 为 image 时，text 中为要发送图片的URL',
        required: false,
        default: 'markdown',
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
                label: '图片',
                value: 'image',
            },
        ],
    },
} as const

export interface PushDeerResponse {
    /**
     * 正确为0，错误为非0
     */
    code: number
    /**
     * 错误信息。无错误时无此字段
     */
    error: string
    /**
     * 消息内容，错误时无此字段
     */
    content: {
        result: string[]
    }
}

/**
 * PushDeer 推送。 官方文档 https://github.com/easychen/pushdeer
 *
 * @author CaoMeiYouRen
 * @date 2022-02-28
 * @export
 * @class PushDeer
 */
export class PushDeer implements Send {

    static configSchema = pushDeerConfigSchema
    static optionSchema = pushDeerOptionSchema

    /**
     * pushkey，请参考 https://github.com/easychen/pushdeer 获取
     *
     * @author CaoMeiYouRen
     * @date 2022-02-28
     * @private
     */
    private PUSH_DEER_PUSH_KEY: string

    /**
     * 使用自架版时的服务器端地址。例如 http://127.0.0.1:8800
     *
     * @author CaoMeiYouRen
     * @date 2022-02-28
     * @private
     */
    private PUSH_DEER_ENDPOINT: string

    /**
     * 创建 PushDeer 实例
     * @author CaoMeiYouRen
     * @date 2024-11-08
     * @param config 配置
     */
    constructor(config: PushDeerConfig) {
        const { PUSH_DEER_PUSH_KEY, PUSH_DEER_ENDPOINT } = config
        this.PUSH_DEER_PUSH_KEY = PUSH_DEER_PUSH_KEY
        this.PUSH_DEER_ENDPOINT = PUSH_DEER_ENDPOINT || 'https://api2.pushdeer.com'
        Debugger('set PUSH_DEER_PUSH_KEY: "%s", PUSH_DEER_ENDPOINT: "%s"', PUSH_DEER_PUSH_KEY, PUSH_DEER_ENDPOINT)
        // 根据 configSchema 验证 config
        validate(config, PushDeer.configSchema)
    }

    /**
     * @author CaoMeiYouRen
     * @date 2024-11-08
     * @param text 推送消息内容
     * @param [desp=''] 消息内容第二部分
     * @param [option={}] 额外推送选项
     */
    async send(title: string, desp: string = '', option?: PushDeerOption): Promise<SendResponse<PushDeerResponse>> {
        Debugger('title: "%s", desp: "%s", option: "%o"', title, desp, option)
        const { type = 'markdown' } = option || {}
        return ajax({
            baseURL: this.PUSH_DEER_ENDPOINT,
            url: '/message/push',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            data: {
                text: title,
                desp,
                pushkey: this.PUSH_DEER_PUSH_KEY,
                type,
            },
        })
    }

}
