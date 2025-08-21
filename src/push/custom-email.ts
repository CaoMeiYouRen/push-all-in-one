import debug from 'debug'
import nodemailer from 'nodemailer'
import SMTPTransport from 'nodemailer/lib/smtp-transport'
import Mail from 'nodemailer/lib/mailer'
import { Send } from '@/interfaces/send'
import { SendResponse } from '@/interfaces/response'
import { ConfigSchema, OptionSchema } from '@/interfaces/schema'
import { validate } from '@/utils/validate'

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

export type CustomEmailConfigSchema = ConfigSchema<CustomEmailConfig>

export const customEmailConfigSchema: CustomEmailConfigSchema = {
    EMAIL_TYPE: {
        type: 'select',
        title: '邮件类型',
        description: '邮件类型',
        required: true,
        default: 'text',
        options: [
            {
                label: '文本',
                value: 'text',
            },
            {
                label: 'HTML',
                value: 'html',
            },
        ],
    },
    EMAIL_TO_ADDRESS: {
        type: 'string',
        title: '收件邮箱',
        description: '收件邮箱',
        required: true,
        default: '',
    },
    EMAIL_AUTH_USER: {
        type: 'string',
        title: '发件邮箱',
        description: '发件邮箱',
        required: true,
        default: '',
    },
    EMAIL_AUTH_PASS: {
        type: 'string',
        title: '发件授权码(或密码)',
        description: '发件授权码(或密码)',
        required: true,
        default: '',
    },
    EMAIL_HOST: {
        type: 'string',
        title: '发件域名',
        description: '发件域名',
        required: true,
        default: '',
    },
    EMAIL_PORT: {
        type: 'number',
        title: '发件端口',
        description: '发件端口',
        required: true,
        default: 465,
    },
} as const

export type CustomEmailOption = Mail.Options

type OptionalCustomEmailOption = Pick<CustomEmailOption, 'to' | 'from' | 'subject' | 'text' | 'html'>

/**
 * 由于 CustomEmailOption 的配置太多，所以不提供完整的 Schema，只提供部分配置 schema。
 * 如需使用完整的配置，请查看官方文档
 */
export type CustomEmailOptionSchema = OptionSchema<{
    [K in keyof OptionalCustomEmailOption]: string
}>

export const customEmailOptionSchema: CustomEmailOptionSchema = {
    to: {
        type: 'string',
        title: '收件邮箱',
        description: '收件邮箱',
        required: false,
        default: '',
    },
    from: {
        type: 'string',
        title: '发件邮箱',
        description: '发件邮箱',
        required: false,
        default: '',
    },
    subject: {
        type: 'string',
        title: '邮件主题',
        description: '邮件主题',
        required: false,
        default: '',
    },
    text: {
        type: 'string',
        title: '邮件内容',
        description: '邮件内容',
        required: false,
        default: '',
    },
    html: {
        type: 'string',
        title: '邮件内容',
        description: '邮件内容',
        required: false,
        default: '',
    },
} as const

/**
 * 自定义邮件。官方文档: https://github.com/nodemailer/nodemailer
 *
 * @author CaoMeiYouRen
 * @date 2023-03-12
 * @export
 * @class CustomEmail
 */
export class CustomEmail implements Send {

    // 命名空间
    static readonly namespace = '自定义邮件'

    static readonly configSchema = customEmailConfigSchema

    static readonly optionSchema = customEmailOptionSchema

    private config: CustomEmailConfig

    private transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo, SMTPTransport.Options>

    constructor(config: CustomEmailConfig) {
        this.config = config
        Debugger('CustomEmailConfig: %o', config)
        // 根据 configSchema 验证 config
        validate(config, CustomEmail.configSchema)
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
