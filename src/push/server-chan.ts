import { ajax } from '@/utils/ajax'
import { AxiosResponse } from 'axios'
import debug from 'debug'
import { warn } from '@/utils/helper'
import { Send } from '../interfaces/send'

const Debugger = debug('push:server-chan')
/**
 *
 *
 * @author CaoMeiYouRen
 * @date 2021-02-27
 * @export
 * @class ServerChan
 * @deprecated 旧版将在2021年4月后下线，请尽快完成配置的更新。详见https://sc.ftqq.com
 */
export class ServerChan implements Send {

    /**
     *
     * @author CaoMeiYouRen
     * @date 2021-02-25
     * @param SCKEY 请前往 https://sc.ftqq.com 领取
     */
    constructor(SCKEY: string) {
        this.SCKEY = SCKEY
        Debugger('set SCKEY: "%s"', SCKEY)
        warn('ServerChan 已弃用！将在2021年4月后下线，请尽快完成配置的更新。详见 https://sc.ftqq.com')
        if (!this.SCKEY) {
            throw new Error('SCKEY 是必须的！')
        }
    }
    /**
     * 请前往 https://sc.ftqq.com 领取
     * @private
     */
    private SCKEY: string

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
            url: `https://sc.ftqq.com/${this.SCKEY}.send`,
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
