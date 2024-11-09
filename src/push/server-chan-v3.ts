import debug from 'debug'
import { Send } from '@/interfaces/send'
import { ajax } from '@/utils/ajax'
import { SendResponse } from '@/interfaces/response'

const Debugger = debug('push:server-chan-v3')

/**
 * 附加参数
 */
export type ServerChanV3Option = {
    tags?: string | string[] // 标签列表，多个标签使用竖线分隔；也可以用数组格式，数组格式下不要加竖线
    short?: string // 推送消息的简短描述，用于指定消息卡片的内容部分，尤其是在推送markdown的时候
}

export interface ServerChanV3Config {
    /**
     * 请前往 https://sc3.ft07.com/sendkey 领取
     */
    SERVER_CHAN_V3_SENDKEY: string
}

export interface ServerChanV3Response {
    // 0 表示成功，其他值表示失败
    code: number
    message: string
    errno: number
    data: {
        // 推送消息的 ID
        pushid: string
        meta: {
            android: any
            devices: any[]
        }
    }
}

/**
 * Server酱³
 * 文档：https://sc3.ft07.com/doc
 * @author CaoMeiYouRen
 * @date 2024-10-04
 * @export
 * @class ServerChanV3
 */
export class ServerChanV3 implements Send {

    /**
     * 请前往 https://sc3.ft07.com/sendkey 领取
     *
     * @author CaoMeiYouRen
     * @date 2024-10-04
     * @private
     */
    private sendkey: string

    private uid: string = ''

    /**
     * 创建 ServerChanV3 实例
     * @author CaoMeiYouRen
     * @date 2024-11-08
     * @param config 请前往 https://sc3.ft07.com/sendkey 领取
     */
    constructor(config: ServerChanV3Config) {
        const { SERVER_CHAN_V3_SENDKEY } = config
        const sendkey = SERVER_CHAN_V3_SENDKEY
        this.sendkey = sendkey
        Debugger('set sendkey: "%s"', sendkey)
        if (!this.sendkey) {
            throw new Error('SERVER_CHAN_V3_SENDKEY 是必须的！')
        }
        this.uid = this.sendkey.match(/^sctp(\d+)t/)?.[1]
        if (!this.uid) {
            throw new Error('SERVER_CHAN_V3_SENDKEY 不合法！')
        }
    }

    /**
     * 发送消息
     *
     * @author CaoMeiYouRen
     * @date 2024-11-08
     * @param title 消息的标题
     * @param [desp=''] 消息的内容，支持 Markdown
     * @param [option={}] 额外发送选项
     */
    async send(title: string, desp: string = '', option: ServerChanV3Option = {}): Promise<SendResponse<ServerChanV3Response>> {
        Debugger('title: "%s", desp: "%s", option: %O', title, desp, option)
        if (Array.isArray(option.tags)) {
            option.tags = option.tags.join('|')
        }
        const data = {
            text: title,
            desp,
            ...option,
        }
        return ajax({
            url: `https://${this.uid}.push.ft07.com/send/${this.sendkey}.send`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            data,
        })
    }

}
