import debug from 'debug'
import { Send } from '../interfaces/send'
import { ajax } from '@/utils/ajax'
import { SendResponse } from '@/interfaces/response'

const Debugger = debug('push:discord')

export interface DiscordConfig {
    /**
     * Webhook Url 可在服务器设置 -> 整合 -> Webhook -> 创建 Webhook 中获取
     */
    DISCORD_WEBHOOK: string
    /**
     * 机器人显示的名称
     */
    DISCORD_USERNAME?: string

    /**
     * 机器人头像的 Url
     */
    DISCORD_AVATAR_URL?: string

    /**
     * 代理地址
     */
    PROXY_URL?: string
}

export type DiscordOption = Pick<DiscordConfig, 'DISCORD_USERNAME' | 'PROXY_URL' | 'DISCORD_AVATAR_URL'>

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
    /**
     * Webhook Url 可在服务器设置 -> 整合 -> Webhook -> 创建 Webhook 中获取
     *
     * @author CaoMeiYouRen
     * @date 2023-09-17
     * @private
     */
    private DISCORD_WEBHOOK: string

    /**
     * 机器人显示的名称
     *
     * @author CaoMeiYouRen
     * @date 2023-09-17
     * @private
     */
    private DISCORD_USERNAME?: string

    proxyUrl: string

    /**
     * 创建 Discord 实例
     * @author CaoMeiYouRen
     * @date 2024-11-08
     * @param config 配置
     */
    constructor(config: DiscordConfig) {
        const { DISCORD_WEBHOOK, DISCORD_USERNAME, PROXY_URL } = config
        Debugger('DISCORD_WEBHOOK: %s, DISCORD_USERNAME: %s, PROXY_URL: %s', DISCORD_WEBHOOK, DISCORD_USERNAME, PROXY_URL)
        this.DISCORD_WEBHOOK = DISCORD_WEBHOOK
        if (DISCORD_USERNAME) {
            this.DISCORD_USERNAME = DISCORD_USERNAME
        }
        if (PROXY_URL) {
            this.proxyUrl = PROXY_URL
        }
        if (!this.DISCORD_WEBHOOK) {
            throw new Error('DISCORD_WEBHOOK 是必须的！')
        }
    }

    /**
     * 发送消息
     *
     * @author CaoMeiYouRen
     * @date 2024-11-08
     * @param title 消息的标题
     * @param [desp] 消息的描述。最多 2000 个字符
     * @param [option] 选项，可以覆盖默认的同名配置
     */
    async send(title: string, desp: string = '', option?: DiscordOption): Promise<SendResponse<DiscordResponse>> {
        Debugger('title: "%s", desp: "%s", option: %o', title, desp, option)
        const { DISCORD_USERNAME, PROXY_URL, DISCORD_AVATAR_URL } = option || {}
        const username = DISCORD_USERNAME || this.DISCORD_USERNAME
        const avatar_url = DISCORD_AVATAR_URL
        const proxyUrl = PROXY_URL || this.proxyUrl
        const content = `${title}\n${desp}`.trim()
        return ajax({
            url: this.DISCORD_WEBHOOK,
            method: 'POST',
            proxyUrl,
            data: {
                username,
                content,
                avatar_url,
            },
        })
    }
}
