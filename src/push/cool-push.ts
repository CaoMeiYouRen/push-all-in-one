import { AxiosResponse } from 'axios'
import debug from 'debug'
import { Send } from '../interfaces/send'
import { ajax } from '@/utils/ajax'

const Debugger = debug('push:cool-push')

/**
 * 推送类型，见 [Cool Push](https://cp.xuthus.cc/)。
 * 暂不支持 一对多推送/指定特定的qq号或者群/企业微信消息推送/钉钉群消息/邮箱消息推送
 */
export type PushType = 'send' | 'group' | 'psend' | 'pgroup' | 'wx' | 'tg'

/**
 * Cool Push QQ消息推送服务。使用说明见 [Cool Push](https://cp.xuthus.cc/)
 *
 * @author CaoMeiYouRen
 * @date 2021-02-27
 * @export
 * @class CoolPush
 */
export class CoolPush implements Send {
    /**
     * 请前往 https://cp.xuthus.cc/ 领取
     *
     * @private
     */
    private SKEY: string
    /**
     *
     * @author CaoMeiYouRen
     * @date 2021-02-27
     * @param SKEY 请前往 https://cp.xuthus.cc/ 领取
     */
    constructor(SKEY: string) {
        this.SKEY = SKEY
        Debugger('set SKEY: "%s"', SKEY)
        if (!this.SKEY) {
            throw new Error('SKEY 是必须的！')
        }
    }
    /**
     *
     *
     * @author CaoMeiYouRen
     * @date 2021-02-27
     * @param content 要发送的内容
     * @param [type='send'] 推送类型
     * @returns
     */
    async send(content: string, type: PushType = 'send'): Promise<AxiosResponse<any>> {
        Debugger('content: "%s" ,type: "%s"', content, type)
        return ajax({
            url: `https://push.xuthus.cc/${type}/${this.SKEY}`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            query: {
                c: content,
            },
        })
    }

}
