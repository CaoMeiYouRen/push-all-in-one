import debug from 'debug'
import nodemailer from 'nodemailer'
import SMTPTransport from 'nodemailer/lib/smtp-transport'
import { Send } from '../interfaces/send'

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

/**
 * 自定义邮件。官方文档: https://github.com/nodemailer/nodemailer
 *
 * @author CaoMeiYouRen
 * @date 2023-03-12
 * @export
 * @class CustomEmail
 */
export class CustomEmail implements Send {

    config: CustomEmailConfig

    constructor(config: CustomEmailConfig) {
        this.config = config
        Debugger('CustomEmailConfig: %o', config)
        Object.entries(config).forEach(([key, value]) => {
            if (!value) {
                throw new Error(`CustomEmailConfig 的 "${key}" 字段是必须的！`)
            }
        })
    }

    /**
     *
     *
     * @author CaoMeiYouRen
     * @date 2023-03-12
     * @param title 消息的标题
     * @param [desp] 消息的内容，支持 html
     */
    async send(title: string, desp?: string): Promise<SMTPTransport.SentMessageInfo> {
        Debugger('title: "%s", desp: "%s"', title, desp)
        const { EMAIL_TYPE, EMAIL_TO_ADDRESS, EMAIL_AUTH_USER, EMAIL_AUTH_PASS, EMAIL_HOST, EMAIL_PORT } = this.config
        const transporter = nodemailer.createTransport({
            host: EMAIL_HOST,
            port: Number(EMAIL_PORT),
            auth: {
                user: EMAIL_AUTH_USER,
                pass: EMAIL_AUTH_PASS,
            },
        })
        if (!await transporter.verify()) {
            throw new Error('自定义邮件的发件配置无效')
        }
        const response = await transporter.sendMail({
            from: EMAIL_AUTH_USER,
            to: EMAIL_TO_ADDRESS,
            subject: title,
            [EMAIL_TYPE]: desp,
        })
        transporter.close()
        Debugger('CustomEmail Response: %o', response)
        return response
    }

}
