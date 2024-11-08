import debug from 'debug'
import { Send } from '../interfaces/send'
import { ajax } from '@/utils/ajax'
import { SendResponse } from '@/interfaces/response'

const Debugger = debug('push:discord')

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

    proxyUrl?: string

    /**
     *
     * @author CaoMeiYouRen
     * @date 2023-09-17
     * @param DISCORD_WEBHOOK Webhook Url 可在服务器设置 -> 整合 -> Webhook -> 创建 Webhook 中获取
     * @param [DISCORD_USERNAME] 机器人显示的名称
     */
    constructor(DISCORD_WEBHOOK: string, DISCORD_USERNAME?: string) {
        Debugger('DISCORD_WEBHOOK: %s, DISCORD_USERNAME: %s', DISCORD_WEBHOOK, DISCORD_USERNAME)
        this.DISCORD_WEBHOOK = DISCORD_WEBHOOK
        if (DISCORD_USERNAME) {
            this.DISCORD_USERNAME = DISCORD_USERNAME
        }
        if (!this.DISCORD_WEBHOOK) {
            throw new Error('DISCORD_WEBHOOK 是必须的！')
        }
    }

    /**
     *
     *
     * @author CaoMeiYouRen
     * @date 2023-09-17
     * @param content 要发送的内容
     * @return
     */
    async send(content: string): Promise<SendResponse> {
        return ajax({
            url: this.DISCORD_WEBHOOK,
            method: 'POST',
            proxyUrl: this.proxyUrl,
            data: {
                username: this.DISCORD_USERNAME,
                content,
            },
        })
    }
}
