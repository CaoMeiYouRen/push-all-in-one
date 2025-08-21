import debug from 'debug'
import { Send } from '@/interfaces/send'
import { ajax } from '@/utils/ajax'
import { SendResponse } from '@/interfaces/response'
import { ConfigSchema, OptionSchema } from '@/interfaces/schema'
import { validate } from '@/utils/validate'

const Debugger = debug('push:discord')

export interface DiscordConfig {
    /**
     * Webhook Url 可在服务器设置 -> 整合 -> Webhook -> 创建 Webhook 中获取
     */
    DISCORD_WEBHOOK: string

    /**
     * 代理地址
     */
    PROXY_URL?: string
}

export type DiscordConfigSchema = ConfigSchema<DiscordConfig>

export const discordConfigSchema: DiscordConfigSchema = {
    DISCORD_WEBHOOK: {
        type: 'string',
        title: 'Webhook Url',
        description: 'Webhook Url 可在服务器设置 -> 整合 -> Webhook -> 创建 Webhook 中获取',
        required: true,
    },
    PROXY_URL: {
        type: 'string',
        title: '代理地址',
        description: '代理地址',
        required: false,
    },
} as const

/**
 * Discord 额外选项
 * 由于参数过多，因此请参考官方文档进行配置
 */
export type DiscordOption = {
    /**
     * 机器人显示的名称
     */
    username?: string
    /**
     * 机器人头像的 Url
     */
    avatar_url?: string
    [key: string]: any
}

export type DiscordOptionSchema = OptionSchema<DiscordOption>

export const discordOptionSchema: DiscordOptionSchema = {
    username: {
        type: 'string',
        title: '机器人显示的名称',
        description: '机器人显示的名称',
        required: false,
    },
    avatar_url: {
        type: 'string',
        title: '机器人头像的 Url',
        description: '机器人头像的 Url',
        required: false,
    },
} as const

export interface DiscordResponse { }

/**
 * Discord Webhook 推送
 *
 * @author CaoMeiYouRen
 * @date 2023-09-17
 * @export
 * @class Discord
 */
export class Discord implements Send {

    static readonly namespace = 'Discord'
    static readonly configSchema = discordConfigSchema
    static readonly optionSchema = discordOptionSchema

    /**
     * Webhook Url 可在服务器设置 -> 整合 -> Webhook -> 创建 Webhook 中获取
     *
     * @author CaoMeiYouRen
     * @date 2023-09-17
     * @private
     */
    private DISCORD_WEBHOOK: string

    proxyUrl: string

    /**
     * 创建 Discord 实例
     * @author CaoMeiYouRen
     * @date 2024-11-08
     * @param config 配置
     */
    constructor(config: DiscordConfig) {
        const { DISCORD_WEBHOOK, PROXY_URL } = config
        Debugger('DISCORD_WEBHOOK: %s, PROXY_URL: %s', DISCORD_WEBHOOK, PROXY_URL)
        this.DISCORD_WEBHOOK = DISCORD_WEBHOOK
        if (PROXY_URL) {
            this.proxyUrl = PROXY_URL
        }
        // 根据 configSchema 验证 config
        validate(config, Discord.configSchema)
    }

    /**
     * 发送消息
     *
     * @author CaoMeiYouRen
     * @date 2024-11-08
     * @param title 消息的标题
     * @param [desp] 消息的描述。最多 2000 个字符
     * @param [option] 额外选项
     */
    async send(title: string, desp?: string, option?: DiscordOption): Promise<SendResponse<DiscordResponse>> {
        Debugger('title: "%s", desp: "%s", option: %o', title, desp, option)
        const { username, avatar_url, ...args } = option || {}
        const proxyUrl = this.proxyUrl
        const content = `${title}${desp ? `\n${desp}` : ''}`
        return ajax({
            url: this.DISCORD_WEBHOOK,
            method: 'POST',
            proxyUrl,
            data: {
                username,
                content,
                avatar_url,
                ...args,
            },
        })
    }

}
