import debug from 'debug'
import { Send } from '@/interfaces/send'
import { ajax } from '@/utils/ajax'
import { SendResponse } from '@/interfaces/response'
import { ConfigSchema, OptionSchema } from '@/interfaces/schema'
import { validate } from '@/utils/validate'

const Debugger = debug('push:xi-zhi')

export interface XiZhiConfig {
    // 息知的 key，前往 https://xz.qqoq.net/#/index 获取
    XI_ZHI_KEY: string
}

export type XiZhiConfigSchema = ConfigSchema<XiZhiConfig>
export const xiZhiConfigSchema: XiZhiConfigSchema = {
    XI_ZHI_KEY: {
        type: 'string',
        title: '息知的 key',
        description: '前往 https://xz.qqoq.net/#/index 获取',
        required: true,
    },
} as const

export interface XiZhiOption {
}

export type XiZhiOptionSchema = OptionSchema<XiZhiOption>
export const xiZhiOptionSchema: XiZhiOptionSchema = {
} as const

export interface XiZhiResponse {
    // 状态码，200 表示成功
    code: number
    msg: string
}

/**
 * 息知 推送，官方文档：https://xz.qqoq.net/#/index
 *
 * @author CaoMeiYouRen
 * @date 2022-02-18
 * @export
 * @class XiZhi
 */
export class XiZhi implements Send {

    static readonly namespace = '息知'
    static readonly configSchema = xiZhiConfigSchema
    static readonly optionSchema = xiZhiOptionSchema

    private XI_ZHI_KEY: string

    constructor(config: XiZhiConfig) {
        const { XI_ZHI_KEY } = config
        this.XI_ZHI_KEY = XI_ZHI_KEY
        Debugger('set XI_ZHI_KEY: "%s"', XI_ZHI_KEY)
        // 根据 configSchema 验证 config
        validate(config, XiZhi.configSchema)
    }

    async send(title: string, desp?: string, option?: XiZhiOption): Promise<SendResponse<XiZhiResponse>> {
        Debugger('title: "%s", desp: "%s"', title, desp)
        return ajax({
            url: `https://xizhi.qqoq.net/${this.XI_ZHI_KEY}.send`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            data: {
                title,
                content: desp,
            },
        })
    }

}
