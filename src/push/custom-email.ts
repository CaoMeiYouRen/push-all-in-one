import debug from 'debug'
import nodemailer from 'nodemailer'
import SMTPTransport from 'nodemailer/lib/smtp-transport'
import Mail from 'nodemailer/lib/mailer'
import { Send } from '@/interfaces/send'
import { SendResponse } from '@/interfaces/response'

const Debugger = debug('push:custom-email')

export type CustomEmailType = 'text' | 'html'
export interface CustomEmailConfig {
    /**
     *  邮件类型
     */
    EMAIL_TYPE: CustomEmailType
    /**
     * 收件邮箱
     */
    EMAIL_TO_ADDRESS: string
    /**
     * 发件邮箱
     */
    EMAIL_AUTH_USER: string
    /**
     * 发件授权码(或密码)
     */
    EMAIL_AUTH_PASS: string
    /**
     * 发件域名
     */
    EMAIL_HOST: string
    /**
     * 发件端口
     */
    EMAIL_PORT: number
}

export type CustomEmailOption = Mail.Options

/**
 * 自定义邮件。官方文档: https://github.com/nodemailer/nodemailer
 *
 * @author CaoMeiYouRen
 * @date 2023-03-12
 * @export
 * @class CustomEmail
 */
export class CustomEmail implements Send {

    private config: CustomEmailConfig

    private transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo, SMTPTransport.Options>

    constructor(config: CustomEmailConfig) {
        this.config = config
        Debugger('CustomEmailConfig: %o', config)
        Object.entries(config).forEach(([key, value]) => {
            if (!value) {
                throw new Error(`CustomEmailConfig 的 "${key}" 字段是必须的！`)
            }
        })
        const { EMAIL_AUTH_USER, EMAIL_AUTH_PASS, EMAIL_HOST, EMAIL_PORT } = this.config
        this.transporter = nodemailer.createTransport({
            host: EMAIL_HOST,
            port: Number(EMAIL_PORT),
            auth: {
                user: EMAIL_AUTH_USER,
                pass: EMAIL_AUTH_PASS,
            },
        })
    }

    /**
     * 释放资源（需要支持 Symbol.dispose）
     *
     * @author CaoMeiYouRen
     * @date 2024-11-08
     */
    [Symbol.dispose](): void {
        if (this.transporter) {
            this.transporter.close()
        }
    }

    /**
     *
     * @author CaoMeiYouRen
     * @date 2024-11-08
     * @param title 消息的标题
     * @param [desp] 消息的内容，支持 html
     * @param [option] 额外选项
     */
    async send(title: string, desp?: string, option?: CustomEmailOption): Promise<SendResponse<SMTPTransport.SentMessageInfo>> {
        Debugger('title: "%s", desp: "%s", option: %o', title, desp, option)
        const { EMAIL_TYPE, EMAIL_TO_ADDRESS, EMAIL_AUTH_USER } = this.config
        if (!await this.transporter.verify()) {
            throw new Error('自定义邮件的发件配置无效')
        }
        const { to: _to, ...args } = option || {}
        const from = EMAIL_AUTH_USER
        const to = _to || EMAIL_TO_ADDRESS
        const type = EMAIL_TYPE
        const response = await this.transporter.sendMail({
            from,
            to,
            subject: title,
            [type]: desp,
            ...args,
        })
        if (typeof Symbol.dispose === 'undefined') { // 如果不支持 Symbol.dispose ，则手动释放
            this.transporter.close()
        }
        Debugger('CustomEmail Response: %o', response)
        if (response.response?.includes('250 OK')) {
            return {
                status: 200,
                statusText: 'OK',
                data: response,
                headers: {},
            }
        }
        return {
            status: 500,
            statusText: 'Internal Server Error',
            data: response,
            headers: {},
        }
    }
}
