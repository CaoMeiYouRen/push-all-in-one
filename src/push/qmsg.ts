import debug from 'debug'
import { Send } from '../interfaces/send'
import { ajax } from '@/utils/ajax'
import { SendResponse } from '@/interfaces/response'

const Debugger = debug('push:qmsg')

/**
 * 推送类型，见 [Qmsg](https://qmsg.zendee.cn/docs/api)。
 */
export type QmsgPushType = 'send' | 'group'

/**
 * Qmsg酱。使用说明见 [Qmsg酱](https://qmsg.zendee.cn/docs)
 *
 * @author CaoMeiYouRen
 * @date 2022-02-17
 * @export
 * @class Qmsg
 */
export class Qmsg implements Send {

    private QMSG_KEY: string
    private QMSG_BOT?: string

    constructor(QMSG_KEY: string, QMSG_BOT?: string) {
        this.QMSG_KEY = QMSG_KEY
        this.QMSG_BOT = QMSG_BOT
        Debugger('set QMSG_KEY: "%s", QMSG_BOT:  "%s"', QMSG_KEY, QMSG_BOT)
        if (!this.QMSG_KEY) {
            throw new Error('QMSG_KEY 是必须的！')
        }
    }

    /**
     *
     *
     * @author CaoMeiYouRen
     * @date 2024-10-30
     * @param msg 要推送的消息内容
     * @param [qq] 指定要接收消息的QQ号或者QQ群。多个以英文逗号分割，例如：12345,12346
     * @param [type='send'] send 表示发送消息给指定的QQ号，group 表示发送消息给指定的QQ群。默认为 send
     */
    async send(msg: string, qq?: string, type: QmsgPushType = 'send'): Promise<SendResponse> {
        Debugger('msg: "%s", qq: "%s", type: "%s"', msg, qq, type)
        return ajax({
            url: `https://qmsg.zendee.cn/${type}/${this.QMSG_KEY}`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            method: 'POST',
            data: { msg, qq, bot: this.QMSG_BOT },
        })
    }

}
