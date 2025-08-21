import debug from 'debug'
import { Send } from '@/interfaces/send'
import { ajax } from '@/utils/ajax'
import { SendResponse } from '@/interfaces/response'
import { ConfigSchema, OptionSchema } from '@/interfaces/schema'
import { validate } from '@/utils/validate'

const Debugger = debug('push:feishu')

export interface FeishuConfig {
    /**
     * 飞书应用 ID。官方文档：https://open.feishu.cn/document/server-docs/api-call-guide/terminology#b047be0c
     */
    FEISHU_APP_ID: string
    /**
     * 飞书应用密钥。官方文档：https://open.feishu.cn/document/server-docs/api-call-guide/terminology#1b5fb6cd
     */
    FEISHU_APP_SECRET: string
}

export type FeishuConfigSchema = ConfigSchema<FeishuConfig>

export const feishuConfigSchema: FeishuConfigSchema = {
    FEISHU_APP_ID: {
        type: 'string',
        title: '飞书应用 ID',
        description: '飞书应用 ID',
        required: true,
        default: '',
    },
    FEISHU_APP_SECRET: {
        type: 'string',
        title: '飞书应用密钥',
        description: '飞书应用密钥',
        required: true,
        default: '',
    },
}

export type FeishuOption = {
    // 用户 ID 类型
    receive_id_type: 'open_id' | 'union_id' | 'user_id' | 'email' | 'chat_id'
    // 消息接收者的 ID，ID 类型与查询参数 receive_id_type 的取值一致。
    receive_id: string
    // 消息类型。
    msg_type: 'text' | 'post' | 'image' | 'file' | 'audio' | 'media' | 'sticker' | 'interactive' | 'share_chat' | 'share_user' | 'system'
    // 消息内容，JSON 结构序列化后的字符串。该参数的取值与 msg_type 对应，例如 msg_type 取值为 text，则该参数需要传入文本类型的内容。
    content?: string
    // 自定义设置的唯一字符串序列，用于在发送消息时请求去重。持有相同 uuid 的请求，在 1 小时内至多成功发送一条消息。
    uuid?: string
}

export type FeishuOptionSchema = OptionSchema<FeishuOption>

export const feishuOptionSchema: FeishuOptionSchema = {
    receive_id_type: {
        type: 'select',
        title: '用户 ID 类型',
        description: '用户 ID 类型',
        required: true,
        options: [
            {
                label: 'open_id',
                value: 'open_id',
            },
            {
                label: 'union_id',
                value: 'union_id',
            },
            {
                label: 'user_id',
                value: 'user_id',
            },
            {
                label: 'email',
                value: 'email',
            },
            {
                label: 'chat_id',
                value: 'chat_id',
            },
        ],
    },
    receive_id: {
        type: 'string',
        title: '消息接收者的 ID',
        description: '消息接收者的 ID，ID 类型与查询参数 receive_id_type 的取值一致。',
        required: true,
    },
    msg_type: {
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
                label: '富文本',
                value: 'post',
            },
            {
                label: '图片',
                value: 'image',
            },
            {
                label: '文件',
                value: 'file',
            },
            {
                label: '语音',
                value: 'audio',
            },
            {
                label: '视频',
                value: 'media',
            },
            {
                label: '表情包',
                value: 'sticker',
            },
            {
                label: '卡片',
                value: 'interactive',
            },
            {
                label: '分享群名片',
                value: 'share_chat',
            },
            {
                label: '分享个人名片',
                value: 'share_user',
            },
            {
                label: '系统消息',
                value: 'system',
            },
        ],
    },
    content: {
        type: 'string',
        title: '消息内容',
        description: '消息内容，JSON 结构序列化后的字符串。该参数的取值与 msg_type 对应，例如 msg_type 取值为 text，则该参数需要传入文本类型的内容。',
        required: false,
    },
    uuid: {
        type: 'string',
        title: '自定义设置的唯一字符串序列',
        description: '自定义设置的唯一字符串序列，用于在发送消息时请求去重。持有相同 uuid 的请求，在 1 小时内至多成功发送一条消息。',
        required: false,
    },
}

/**
 * 飞书。官方文档：https://open.feishu.cn/document/home/index
 *
 * @author CaoMeiYouRen
 * @date 2025-02-10
 * @export
 * @class Feishu
 */
export class Feishu implements Send {

    static readonly namespace = '飞书'

    static readonly configSchema = feishuConfigSchema

    static readonly optionSchema = feishuOptionSchema

    private readonly config: FeishuConfig

    /**
    * accessToken 的过期时间(时间戳)
    */
    private expiresTime: number

    private accessToken: string

    constructor(config: FeishuConfig) {
        this.config = config
        // 根据 configSchema 验证 config
        validate(config, Feishu.configSchema)
    }

    private async getAccessToken() {
        const { FEISHU_APP_ID, FEISHU_APP_SECRET } = this.config
        const url = 'https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal'
        const data = {
            app_id: FEISHU_APP_ID,
            app_secret: FEISHU_APP_SECRET,
        }
        const result = await ajax({
            url,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
            },
            data,
        })
        const { code, msg, tenant_access_token, expire } = result.data
        if (code !== 0) { // 出错返回码，为0表示成功，非0表示调用失败
            throw new Error(msg || '获取 tenant_access_token 失败！')
        }
        this.expiresTime = Date.now() + expire * 1000
        Debugger('获取 tenant_access_token 成功: %s', tenant_access_token)
        return tenant_access_token as string
    }

    async send(title: string, desp?: string, option?: FeishuOption): Promise<SendResponse> {
        Debugger('title: "%s", desp: "%s", option: %O', title, desp, option)
        if (!this.accessToken || Date.now() >= this.expiresTime) {
            this.accessToken = await this.getAccessToken()
        }
        const { receive_id_type = 'open_id', receive_id, msg_type = 'text', content, uuid } = option
        const data = { receive_id, msg_type, content, uuid }
        if (!data.content) {
            switch (msg_type) {
                case 'text':
                    data.content = JSON.stringify({
                        text: `${title}${desp ? `\n${desp}` : ''}`,
                    })
                    break
                case 'post':
                    data.content = JSON.stringify({
                        post: {
                            zh_cn: {
                                title,
                                content: [
                                    [
                                        {
                                            tag: 'text',
                                            text: desp,
                                        },
                                    ],
                                ],
                            },
                        },
                    })
                    break
                default:
                    throw new Error('msg_type is required!')
            }
        }
        const result = await ajax({
            url: 'https://open.feishu.cn/open-apis/im/v1/messages',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                Authorization: `Bearer ${this.accessToken}`,
            },
            data,
            query: {
                receive_id_type: receive_id_type || 'open_id',
            },
        })
        return result
    }

}
