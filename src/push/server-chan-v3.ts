import debug from 'debug'
import { Send } from '@/interfaces/send'
import { ajax } from '@/utils/ajax'

const Debugger = debug('push:server-chan-v3')

/**
 * 附加参数
 */
export type ServerChanV3Options = {
    tags?: string | string[] // 标签列表，多个标签使用竖线分隔；也可以用数组格式，数组格式下不要加竖线
    short?: string // 推送消息的简短描述，用于指定消息卡片的内容部分，尤其是在推送markdown的时候
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
     * @author CaoMeiYouRen
     * @date 2024-10-04
     * @param sendkey 请前往 https://sc3.ft07.com/sendkey 领取
     */
    constructor(sendkey: string) {
        this.sendkey = sendkey
        Debugger('set sendkey: "%s"', sendkey)
        if (!this.sendkey) {
            throw new Error('sendkey 是必须的！')
        }
        this.uid = this.sendkey.match(/^sctp(\d+)t/)?.[1]
        if (!this.uid) {
            throw new Error('sendkey 不合法！')
        }
    }

    async send(text: string, desp: string = '', options: ServerChanV3Options = {}): Promise<any> {
        Debugger('text: "%s", desp: "%s", options: %O', text, desp, options)
        if (Array.isArray(options.tags)) {
            options.tags = options.tags.join('|')
        }
        const data = {
            text,
            desp,
            ...options,
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
