import debug from 'debug'
import { Send } from '@/interfaces/send'
import { ajax } from '@/utils/ajax'
import { SendResponse } from '@/interfaces/response'
import { ConfigSchema, OptionSchema } from '@/interfaces/schema'
import { validate } from '@/utils/validate'
import { rfc2047Encode } from '@/utils/crypto'

const Debugger = debug('push:ntfy')

export interface NtfyConfig {
    /**
     * 推送地址
     */
    NTFY_URL: string

    /**
     * 主题
     * 用于区分不同的推送目标。
     * 主题本质上是一个密码，所以请选择不容易猜到的东西。
     * 例如：`my-topic`
     */
    NTFY_TOPIC: string

    /**
     * 认证参数。
     * 支持 Basic Auth、Bearer Token。
     * Basic Auth 示例："Basic dGVzdDpwYXNz"
     * Bearer Token 示例："Bearer tk_..."
     */
    NTFY_AUTH?: string
}

export type NtfyConfigSchema = ConfigSchema<NtfyConfig>
export const ntfyConfigSchema: NtfyConfigSchema = {
    NTFY_URL: {
        type: 'string',
        title: '推送地址',
        description: '推送地址',
        required: true,
        default: '',
    },
    NTFY_TOPIC: {
        type: 'string',
        title: '主题',
        description: '主题',
        required: true,
        default: '',
    },
    NTFY_AUTH: {
        type: 'string',
        title: '认证参数',
        description: '支持 Basic Auth、Bearer Token。\n' +
            'Basic Auth 示例："Basic dGVzdDpwYXNz"\n' +
            'Bearer Token 示例："Bearer tk_..."',
        required: false,
        default: '',
    },
} as const

export interface NtfyOption {
    /**
     * 通知中显示的标题
     */
    title?: string
    /**
     * 通知中显示的消息正文
     */
    message?: string
    /**
     * 消息正文
     */
    body?: string
    /**
     * 消息优先级（1-5，1最低，5最高）
     */
    priority?: number
    /**
     * 标签列表（逗号分隔），支持Emoji短代码
     */
    tags?: string
    /**
     * 启用Markdown格式化（设为`true`或`yes`）
     */
    markdown?: boolean
    /**
     * 延迟发送时间（支持时间戳、自然语言如`tomorrow 10am`）
     */
    delay?: string
    /**
     * 点击通知时打开的URL
     */
    click?: string
    /**
     * 附加文件的URL
     */
    attach?: string
    /**
     * 附件的显示文件名
     */
    filename?: string
    /**
     * 通知图标的URL（仅支持JPEG/PNG）
     */
    icon?: string
    /**
     * 定义通知的操作按钮（JSON或简写格式）
     */
    actions?: string
    /**
     * 设为`no`禁止服务器缓存消息
     */
    cache?: boolean
    /**
     * 设为`no`禁止转发到Firebase（仅影响Android推送）
     */
    firebase?: boolean
    /**
     * 设为`1`启用UnifiedPush模式（用于Matrix网关）
     */
    unifiedPush?: boolean
    /**
     * 将通知转发到指定邮箱
     */
    email?: string
    /**
     * 发送语音呼叫（需验证手机号，仅限认证用户）
     */
    call?: string
    /**
     * 设为`text/markdown`启用Markdown
     */
    contentType?: string
    /**
     * 直接上传文件作为附件（需设置`X-Filename`）
     */
    file?: File
}

export type NtfyOptionSchema = OptionSchema<NtfyOption>

export const ntfyOptionSchema: NtfyOptionSchema = {
    title: {
        type: 'string',
        title: '标题',
        description: '标题',
        required: false,
        default: '',
    },
    body: {
        type: 'string',
        title: '消息正文',
        description: '消息正文',
        required: false,
        default: '',
    },
    priority: {
        type: 'number',
        title: '消息优先级',
        description: '消息优先级（1-5，1最低，5最高）',
        required: false,
        default: 3,
    },
    tags: {
        type: 'string',
        title: '标签列表',
        description: '标签列表（逗号分隔），支持Emoji短代码',
        required: false,
        default: '',
    },
    markdown: {
        type: 'boolean',
        title: '启用Markdown格式',
        description: '启用Markdown格式（设为`true`或`yes`）',
        required: false,
        default: false,
    },
    delay: {
        type: 'string',
        title: '延迟发送时间',
        description: '延迟发送时间（支持时间戳、自然语言如`tomorrow 10am`）',
        required: false,
        default: '',
    },
    click: {
        type: 'string',
        title: '点击通知时打开的URL',
        description: '点击通知时打开的URL',
        required: false,
        default: '',
    },
    attach: {
        type: 'string',
        title: '附加文件的URL',
        description: '附加文件的URL',
        required: false,
        default: '',
    },
    filename: {
        type: 'string',
        title: '附件的显示文件名',
        description: '附件的显示文件名',
        required: false,
        default: '',
    },
    icon: {
        type: 'string',
        title: '通知图标的URL',
        description: '通知图标的URL（仅支持JPEG/PNG）',
        required: false,
        default: '',
    },
    actions: {
        type: 'string',
        title: '定义通知的操作按钮',
        description: '定义通知的操作按钮（JSON或简写格式）',
        required: false,
        default: '',
    },
    cache: {
        type: 'boolean',
        title: '禁止服务器缓存消息',
        description: '设为`no`禁止服务器缓存消息',
        required: false,
        default: false,
    },
    firebase: {
        type: 'boolean',
        title: '禁止转发到Firebase',
        description: '设为`no`禁止转发到Firebase（仅影响Android推送）',
        required: false,
        default: false,
    },
    unifiedPush: {
        type: 'boolean',
        title: '启用UnifiedPush模式',
        description: '设为`1`启用UnifiedPush模式（用于Matrix网关）',
        required: false,
        default: false,
    },
    email: {
        type: 'string',
        title: '邮箱',
        description: '将通知转发到指定邮箱',
        required: false,
        default: '',
    },
    call: {
        type: 'string',
        title: '发送语音呼叫',
        description: '发送语音呼叫（需验证手机号，仅限认证用户）',
        required: false,
        default: '',
    },
    contentType: {
        type: 'string',
        title: '编码格式',
        description: '设为`text/markdown`启用Markdown',
        required: false,
        default: '',
    },
    file: {
        type: 'object',
        title: '附件',
        description: '直接上传文件作为附件（需设置`X-Filename`）',
        required: false,
    },
} as const

export interface NtfyResponse {
    /**
     * 消息ID
     */
    id: string
    /**
     * 消息发布时间（Unix时间戳）
     */
    time: number
    /**
     * 消息过期时间（Unix时间戳）
     */
    expires: number
    /**
     * 事件类型
     */
    event: string
    /**
     * 主题
     */
    topic: string
    /**
     * 消息内容
     */
    message: string
}

/**
 * ntfy推送。
 * 官方文档：https://ntfy.sh/docs/publish/
 *
 * @author CaoMeiYouRen
 * @date 2025-02-11
 * @export
 * @class Ntfy
 */
export class Ntfy implements Send {
    static readonly namespace = 'ntfy'
    static readonly configSchema = ntfyConfigSchema
    static readonly optionSchema = ntfyOptionSchema
    /**
     * 推送地址
     */
    private NTFY_URL: string
    /**
     * 认证参数。
     * 支持 Basic Auth、Bearer Token。
     * Basic Auth 示例："Basic dGVzdDpwYXNz"
     * Bearer Token 示例："Bearer tk_..."
     */
    private NTFY_AUTH?: string

    /**
     * 主题
     * 用于区分不同的推送目标。
     * 主题本质上是一个密码，所以请选择不容易猜到的东西。
     * 例如：`my-topic`
     */
    private NTFY_TOPIC: string

    constructor(config: NtfyConfig) {
        const { NTFY_URL, NTFY_AUTH, NTFY_TOPIC } = config
        this.NTFY_URL = NTFY_URL
        this.NTFY_TOPIC = NTFY_TOPIC
        this.NTFY_AUTH = NTFY_AUTH
        Debugger('set NTFY_URL: "%s", NTFY_TOPIC: "%s", NTFY_AUTH: "%s"', NTFY_URL, NTFY_TOPIC, NTFY_AUTH)
        // 根据 configSchema 验证 config
        validate(config, Ntfy.configSchema)
    }

    async send(title: string, desp: string, option?: NtfyOption): Promise<SendResponse<NtfyResponse>> {
        Debugger('option: "%o"', option)
        const { message, body, priority, tags, markdown, delay, click, attach, filename, icon, actions, cache, firebase, unifiedPush, email, call, contentType, file } = option || {}
        const headers: any = {}
        if (this.NTFY_AUTH) {
            headers['Authorization'] = this.NTFY_AUTH
        }
        if (contentType) {
            headers['Content-Type'] = contentType
        }
        const xTitle = title || option.title
        if (xTitle) {
            headers['X-Title'] = rfc2047Encode(xTitle)
        }
        if (message) {
            headers['X-Message'] = rfc2047Encode(message)
        }
        if (priority) {
            headers['X-Priority'] = priority.toString()
        }
        if (tags) {
            headers['X-Tags'] = tags
        }
        if (markdown) {
            headers['X-Markdown'] = markdown.toString()
        }
        if (delay) {
            headers['X-Delay'] = delay
        }
        if (click) {
            headers['X-Click'] = click
        }
        if (attach) {
            headers['X-Attach'] = attach
        }
        if (filename) {
            headers['X-Filename'] = filename
        }
        if (icon) {
            headers['X-Icon'] = icon
        }
        if (actions) {
            headers['X-Actions'] = actions
        }
        if (cache) {
            headers['X-Cache'] = cache ? 'yes' : 'no'
        }
        if (firebase) {
            headers['X-Firebase'] = firebase ? 'yes' : 'no'
        }
        if (unifiedPush) {
            headers['X-UnifiedPush'] = unifiedPush ? '1' : '0'
        }
        if (email) {
            headers['X-Email'] = email
        }
        if (call) {
            headers['X-Call'] = call
        }
        if (file) {
            headers['X-Filename'] = file.name
            headers['Content-Type'] = 'application/octet-stream'
            headers['Content-Length'] = file.size
            headers['Content-Disposition'] = `attachment; filename="${file.name}"`
        }
        Debugger('headers: "%o"', headers)
        const data = desp || body || message
        Debugger('data: "%s"', data)
        const url = new URL(this.NTFY_TOPIC, this.NTFY_URL).toString()
        const response = await ajax({
            url,
            method: 'POST',
            headers,
            data,
        })
        return response
    }
}
