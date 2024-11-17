import debug from 'debug'
import { Send } from '@/interfaces/send'
import { ajax } from '@/utils/ajax'
import { SendResponse } from '@/interfaces/response'
import { ConfigSchema, OptionSchema } from '@/interfaces/schema'
import { validate } from '@/utils/validate'

const Debugger = debug('push:qmsg')

/**
 * 推送类型，见 [Qmsg](https://qmsg.zendee.cn/docs/api)。
 */
export type QmsgPushType = 'send' | 'group'

export interface QmsgConfig {
    /**
     * 推送的 key。在 [Qmsg 酱管理台](https://qmsg.zendee.cn/user) 查看
     */
    QMSG_KEY: string
}
export type QmsgConfigSchema = ConfigSchema<QmsgConfig>

export const qmsgConfigSchema: QmsgConfigSchema = {
    QMSG_KEY: {
        type: 'string',
        title: '推送的 key',
        description: '在 [Qmsg 酱管理台](https://qmsg.zendee.cn/user) 查看',
        required: true,
    },
} as const

export interface QmsgPrivateMsgOption {
    /**
     * send 表示发送消息给指定的QQ号，group 表示发送消息给指定的QQ群。默认为 send
     */
    type: 'send'
    /**
     * 指定要接收消息的QQ号或者QQ群。多个以英文逗号分割，例如：12345,12346
     */
    qq: string
}

export interface QmsgGroupMsgOption {
    /**
     * send 表示发送消息给指定的QQ号，group 表示发送消息给指定的QQ群。默认为 send
     */
    type: 'group'
    /**
     * 指定要接收消息的QQ号或者QQ群。多个以英文逗号分割，例如：12345,12346
     */
    qq: string

}

export type QmsgOption = (QmsgPrivateMsgOption | QmsgGroupMsgOption) & {
    /**
     * 机器人的QQ号。指定使用哪个机器人来发送消息，不指定则会自动随机选择一个在线的机器人发送消息。该参数仅私有云有效
     */
    bot?: string
}

export type QmsgOptionSchema = OptionSchema<{
    // 消息类型
    type: 'send' | 'group'
    // 指定要接收消息的QQ号或者QQ群。多个以英文逗号分割，例如：12345,12346
    qq: string
    // 机器人的QQ号。指定使用哪个机器人来发送消息，不指定则会自动随机选择一个在线的机器人发送消息。该参数仅私有云有效
    bot?: string
}>

export const qmsgOptionSchema: QmsgOptionSchema = {
    type: {
        type: 'select',
        title: '消息类型',
        description: 'send 表示发送消息给指定的QQ号，group 表示发送消息给指定的QQ群。默认为 send',
        required: true,
        default: 'send',
        options: [
            {
                label: '私聊',
                value: 'send',
            },
            {
                label: '群聊',
                value: 'group',
            },
        ],
    },
    qq: {
        type: 'string',
        title: '指定要接收消息的QQ号或者QQ群',
        description: '多个以英文逗号分割，例如：12345,12346',
        required: true,
    },
    bot: {
        type: 'string',
        title: '机器人的QQ号',
        description: '指定使用哪个机器人来发送消息，不指定则会自动随机选择一个在线的机器人发送消息。该参数仅私有云有效',
        required: false,
    },
} as const

export interface QmsgResponse {
    /**
     * 本次请求是否成功
     */
    success: boolean
    /**
     * 本次请求结果描述
     */
    reason: string
    /**
     * 错误代码。错误代码目前不可靠，如果要判断是否成功请使用success
     */
    code: number
    info: any
}

/**
 * Qmsg酱。使用说明见 [Qmsg酱](https://qmsg.zendee.cn/docs)
 *
 * @author CaoMeiYouRen
 * @date 2022-02-17
 * @export
 * @class Qmsg
 */
export class Qmsg implements Send {

    static configSchema = qmsgConfigSchema
    static optionSchema = qmsgOptionSchema

    private QMSG_KEY: string

    constructor(config: QmsgConfig) {
        const { QMSG_KEY } = config
        this.QMSG_KEY = QMSG_KEY
        Debugger('set QMSG_KEY: "%s"', QMSG_KEY)
        // 根据 configSchema 验证 config
        validate(config, Qmsg.configSchema)
    }

    /**
     *
     * 发送消息
     * @author CaoMeiYouRen
     * @date 2024-11-08
     * @param title 消息标题
     * @param [desp] 消息描述
     * @param [option] QmsgOption 选项
     */
    async send(title: string, desp: string, option: QmsgOption): Promise<SendResponse<QmsgResponse>> {
        Debugger('title: "%s", desp: "%s", option: "%o"', title, desp, option)
        // !由于 Qmsg 酱的 option 中带有必填项，所以需要校验
        // 根据 optionSchema 验证 option
        validate(option, Qmsg.optionSchema)
        const { qq, type = 'send', bot } = option || {}
        const msg = `${title}${desp ? `\n${desp}` : ''}`
        return ajax({
            url: `https://qmsg.zendee.cn/${type}/${this.QMSG_KEY}`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            method: 'POST',
            data: { msg, qq, bot },
        })
    }

}
