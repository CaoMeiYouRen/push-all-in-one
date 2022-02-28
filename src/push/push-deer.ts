import { AxiosResponse } from 'axios'
import debug from 'debug'
import { Send } from '../interfaces/send'
import { ajax } from '@/utils/ajax'

const Debugger = debug('push:push-deer')

export type PushDeerPushType = 'markdown' | 'text' | 'image'

/**
 * PushDeer 推送。 官方文档 https://github.com/easychen/pushdeer
 *
 * @author CaoMeiYouRen
 * @date 2022-02-28
 * @export
 * @class PushDeer
 */
export class PushDeer implements Send {

    /**
     * pushkey，请参考 https://github.com/easychen/pushdeer 获取
     *
     * @author CaoMeiYouRen
     * @date 2022-02-28
     * @private
     */
    private PUSH_DEER_PUSH_KEY: string

    /**
     * 使用自架版时的服务器端地址。例如 http://127.0.0.1:8800
     *
     * @author CaoMeiYouRen
     * @date 2022-02-28
     * @private
     */
    private PUSH_DEER_ENDPOINT: string

    /**
     *
     * @author CaoMeiYouRen
     * @date 2022-02-28
     * @param PUSH_DEER_PUSH_KEY pushkey
     * @param [PUSH_DEER_ENDPOINT] 使用自架版时的服务器端地址
     */
    constructor(PUSH_DEER_PUSH_KEY: string, PUSH_DEER_ENDPOINT?: string) {
        this.PUSH_DEER_PUSH_KEY = PUSH_DEER_PUSH_KEY
        this.PUSH_DEER_ENDPOINT = PUSH_DEER_ENDPOINT || 'https://api2.pushdeer.com'
        Debugger('set PUSH_DEER_PUSH_KEY: "%s", PUSH_DEER_ENDPOINT: "%s"', PUSH_DEER_PUSH_KEY, PUSH_DEER_ENDPOINT)
        if (!this.PUSH_DEER_PUSH_KEY) {
            throw new Error('PUSH_DEER_PUSH_KEY 是必须的！')
        }
    }

    /**
     *
     *
     * @author CaoMeiYouRen
     * @date 2022-02-28
     * @param text 推送消息内容
     * @param [desp=''] 消息内容第二部分
     * @param [type='markdown'] 格式。文本=text，markdown，图片=image，默认为markdown。type 为 image 时，text 中为要发送图片的URL
     */
    async send(text: string, desp: string = '', type: PushDeerPushType = 'markdown'): Promise<AxiosResponse<any>> {
        Debugger('text: "%s", desp: "%s", type: "%s"', text, desp, type)
        return ajax({
            baseURL: this.PUSH_DEER_ENDPOINT,
            url: '/message/push',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            data: {
                text,
                desp,
                pushkey: this.PUSH_DEER_PUSH_KEY,
                type,
            },
        })
    }

}
