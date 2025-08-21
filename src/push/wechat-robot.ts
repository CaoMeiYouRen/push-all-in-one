import debug from 'debug'
import { Send } from '@/interfaces/send'
import { ajax } from '@/utils/ajax'
import { SendResponse } from '@/interfaces/response'
import { ConfigSchema, OptionSchema } from '@/interfaces/schema'
import { validate } from '@/utils/validate'

const Debugger = debug('push:wechat-robot')

export type WechatRobotMsgType = 'text' | 'markdown' | 'image' | 'news' | 'file' | 'voice' | 'template_card'

export interface WechatRobotConfig {
    // 企业微信机器人的key
    WECHAT_ROBOT_KEY: string
}
export type WechatRobotConfigSchema = ConfigSchema<WechatRobotConfig>
export const wechatRobotConfigSchema: WechatRobotConfigSchema = {
    WECHAT_ROBOT_KEY: {
        type: 'string',
        title: '企业微信机器人的key',
        description: '企业微信机器人的key',
        required: true,
    },
} as const

export interface WechatRobotOption {
    msgtype?: WechatRobotMsgType
    [key: string]: any
}
export type WechatRobotOptionSchema = OptionSchema<WechatRobotOption>
export const wechatRobotOptionSchema: WechatRobotOptionSchema = {
    msgtype: {
        type: 'select',
        title: '消息类型',
        description: '消息类型',
        options: [
            {
                label: '文本',
                value: 'text',
            },
            {
                label: 'Markdown',
                value: 'markdown',
            },
            {
                label: '图片',
                value: 'image',
            },
            {
                label: '图文',
                value: 'news',
            },
            {
                label: '文件',
                value: 'file',
            },
            {
                label: '语音',
                value: 'voice',
            },
            {
                label: '模板卡片',
                value: 'template_card',
            },
        ],
        required: false,
        default: 'text',
    },
} as const

export interface WechatRobotResponse {
    // 企业微信机器人返回的错误码，为0表示成功，非0表示调用失败
    errcode: number
    errmsg: string
}

/**
 * 企业微信群机器人。文档: [如何使用群机器人](https://developer.work.weixin.qq.com/document/path/91770)
 *
 * @author CaoMeiYouRen
 * @date 2021-02-28
 * @export
 * @class WechatRobot
 */
export class WechatRobot implements Send {

    static readonly namespace = '企业微信群机器人'
    static readonly configSchema = wechatRobotConfigSchema
    static readonly optionSchema = wechatRobotOptionSchema

    private WECHAT_ROBOT_KEY: string

    constructor(config: WechatRobotConfig) {
        const { WECHAT_ROBOT_KEY } = config
        this.WECHAT_ROBOT_KEY = WECHAT_ROBOT_KEY
        Debugger('set WECHAT_ROBOT_KEY: "%s"', WECHAT_ROBOT_KEY)
        // 根据 configSchema 验证 config
        validate(config, WechatRobot.configSchema)
    }

    /**
     *
     *
     * @author CaoMeiYouRen
     * @date 2024-11-08
     * @param title 消息标题
     * @param [desp] 消息内容。text内容，最长不超过2048个字节；markdown内容，最长不超过4096个字节；必须是utf8编码
     * @param [option] 额外推送选项
     */
    async send(title: string, desp?: string, option?: WechatRobotOption): Promise<SendResponse<WechatRobotResponse>> {
        Debugger('title: "%s", desp: "%s", option: %O', title, desp, option)
        const { msgtype = 'text', ...args } = option || {}
        const sep = msgtype === 'markdown' ? '\n\n' : '\n'
        const content = `${title}${desp ? `${sep}${desp}` : ''}`
        return ajax({
            url: 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send',
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
            query: { key: this.WECHAT_ROBOT_KEY },
            data: {
                msgtype,
                [msgtype]: { content },
                ...args,
            },
        })
    }

}
