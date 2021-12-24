import { AxiosResponse } from 'axios'
import debug from 'debug'
import { Send } from '../interfaces/send'
import { ajax } from '@/utils/ajax'

const Debugger = debug('push:server-chan-turbo')

/**
 * 文档 https://sct.ftqq.com/
 *
 * @author CaoMeiYouRen
 * @date 2021-02-27
 * @export
 * @class ServerChanTurbo
 */
export class ServerChanTurbo implements Send {

    /**
     *
     * @author CaoMeiYouRen
     * @date 2021-02-27
     * @param SCTKEY 请前往 https://sct.ftqq.com/sendkey 领取
     */
    constructor(SCTKEY: string) {
        this.SCTKEY = SCTKEY
        Debugger('set SCTKEY: "%s"', SCTKEY)
        if (!this.SCTKEY) {
            throw new Error('SCTKEY 是必须的！')
        }
    }
    /**
     *
     *
     * @private 请前往 https://sct.ftqq.com/sendkey 领取
     */
    private SCTKEY: string

    /**
     * 发送消息
     *
     * @author CaoMeiYouRen
     * @date 2021-02-25
     * @param text 消息的标题
     * @param desp 消息的内容，支持 Markdown
     */
    async send(text: string, desp: string = ''): Promise<AxiosResponse<any>> {
        Debugger('text: "%s", desp: "%s"', text, desp)
        return ajax({
            url: `https://sctapi.ftqq.com/${this.SCTKEY}.send`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            data: {
                text,
                desp,
            },
        })
    }
}
