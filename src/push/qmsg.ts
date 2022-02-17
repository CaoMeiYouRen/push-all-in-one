import { AxiosResponse } from 'axios'
import debug from 'debug'
import { Send } from '../interfaces/send'
import { ajax } from '@/utils/ajax'

const Debugger = debug('push:qmsg')

/**
 * 推送类型，见 [Qmsg](https://qmsg.zendee.cn/api.html)。
 */
export type QmsgPushType = 'send' | 'group'

/**
 * Qmsg酱。使用说明见 [Qmsg酱](https://qmsg.zendee.cn/api.html)
 *
 * @author CaoMeiYouRen
 * @date 2022-02-17
 * @export
 * @class Qmsg
 */
export class Qmsg implements Send {

    private QMSG_KEY: string

    constructor(QMSG_KEY: string) {
        this.QMSG_KEY = QMSG_KEY
        Debugger('set QMSG_KEY: "%s"', QMSG_KEY)
        if (!this.QMSG_KEY) {
            throw new Error('QMSG_KEY 是必须的！')
        }
    }

    async send(msg: string, qq?: string, type: QmsgPushType = 'send'): Promise<any> {
        return ajax({
            url: `https://qmsg.zendee.cn/${type}/${this.QMSG_KEY}`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            method: 'POST',
            data: { msg, qq },
        })
    }

}
