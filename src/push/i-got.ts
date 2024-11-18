import debug from 'debug'
import { Send } from '@/interfaces/send'
import { ajax } from '@/utils/ajax'
import { SendResponse } from '@/interfaces/response'
import { ConfigSchema, OptionSchema } from '@/interfaces/schema'
import { validate } from '@/utils/validate'

const Debugger = debug('push:i-got')

export interface IGotConfig {
    /**
     * 微信搜索小程序“iGot”获取推送key
     */
    I_GOT_KEY: string
}

export type IGotConfigSchema = ConfigSchema<IGotConfig>

export const iGotConfigSchema: IGotConfigSchema = {
    I_GOT_KEY: {
        type: 'string',
        title: 'iGot 推送key',
        description: 'iGot 推送key',
        required: true,
        default: '',
    },
} as const

export interface IGotOption {
    /**
     * 链接； 点开消息后会主动跳转至此地址
     */
    url?: string
    /**
     * 是否自动复制； 为1自动复制
     */
    automaticallyCopy?: number
    /**
     * 紧急消息，为1表示紧急。此消息将置顶在小程序内， 同时会在推送的消息内做一定的特殊标识
     */
    urgent?: number
    /**
     * 需要自动复制的文本内容
     */
    copy?: string
    /**
     * 主题； 订阅链接下有效；对推送内容分类，用户可选择性订阅
     */
    topic?: string
    [key: string]: any
}

export type IGotOptionSchema = OptionSchema<IGotOption>

export const iGotOptionSchema: IGotOptionSchema = {
    url: {
        type: 'string',
        title: '链接',
        description: '链接； 点开消息后会主动跳转至此地址',
        required: false,
        default: '',
    },
    automaticallyCopy: {
        type: 'number',
        title: '是否自动复制',
        description: '是否自动复制； 为1自动复制',
        required: false,
        default: 0,
    },
    urgent: {
        type: 'number',
        title: '紧急消息',
        description: '紧急消息，为1表示紧急。此消息将置顶在小程序内， 同时会在推送的消息内做一定的特殊标识',
        required: false,
        default: 0,
    },
    copy: {
        type: 'string',
        title: '需要自动复制的文本内容',
        description: '需要自动复制的文本内容',
        required: false,
        default: '',
    },
    topic: {
        type: 'string',
        title: '主题',
        description: '主题； 订阅链接下有效；对推送内容分类，用户可选择性订阅',
        required: false,
        default: '',
    },
} as const

export interface IGotResponse {
    /**
     * 状态码； 0为正常
     */
    ret: number
    /**
     * 响应结果
     */
    data: {
        /**
         * 消息记录，后期开放其他接口用
         * */
        id: string
    }
    /**
     * 结果描述
     */
    errMsg: string
}

/**
 * iGot 推送，官方文档：http://hellyw.com
 *
 * @author CaoMeiYouRen
 * @date 2021-03-03
 * @export
 * @class IGot
 */
export class IGot implements Send {
    static readonly namespace = 'iGot'
    static readonly configSchema = iGotConfigSchema
    static readonly optionSchema = iGotOptionSchema
    /**
     * 微信搜索小程序“iGot”获取推送key
     *
     * @private
     */
    private I_GOT_KEY: string
    /**
     * @author CaoMeiYouRen
     * @date 2024-11-08
     * @param config 微信搜索小程序“iGot”获取推送key
     */
    constructor(config: IGotConfig) {
        const { I_GOT_KEY } = config
        this.I_GOT_KEY = I_GOT_KEY
        Debugger('set I_GOT_KEY: "%s"', I_GOT_KEY)
        // 根据 configSchema 验证 config
        validate(config, IGot.configSchema)
    }
    /**
     *
     *
     * @author CaoMeiYouRen
     * @date 2024-11-08
     * @param title 消息标题
     * @param [desp] 消息正文
     * @param [option] 额外选项
     * @returns
     */
    send(title: string, desp?: string, option?: IGotOption): Promise<SendResponse<IGotResponse>> {
        Debugger('title: "%s", desp: "%s", option: "%o"', title, desp, option)
        return ajax({
            url: `https://push.hellyw.com/${this.I_GOT_KEY}`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            data: {
                title,
                content: desp || title,
                automaticallyCopy: 0, // 关闭自动复制
                ...option,
            },
        })
    }

}
