import { ajax } from '@/utils/ajax'
import { AxiosResponse } from 'axios'
import debug from 'debug'
import { error, warn } from '@/utils/helper'
import { Send } from '../interfaces/send'

const Debugger = debug('push:wechat-app')

type WechatAppOption = {
    /**
     * 企业ID，获取方式参考：[术语说明-corpid](https://work.weixin.qq.com/api/doc/90000/90135/91039#14953/corpid)
     *
     */
    WX_APP_CORPID: string
    /**
     * 应用的凭证密钥，获取方式参考：[术语说明-secret](https://work.weixin.qq.com/api/doc/90000/90135/91039#14953/secret)
     *
     */
    WX_APP_SECRET: string
    /**
     * 企业应用的id。企业内部开发，可在应用的设置页面查看
     *
     */
    WX_APP_AGENTID: number
    /**
     * 指定接收消息的成员。若不指定则默认为 ”@all”。
     * 成员ID列表（多个接收者用‘|’分隔，最多支持1000个）。
     * 特殊情况：指定为”@all”，则向该企业应用的全部成员发送。
     *
     */
    WX_APP_USERID?: string
}

/**
 * 企业微信应用推送，文档：https://work.weixin.qq.com/api/doc/90000/90135/90664
 *
 * @author CaoMeiYouRen
 * @date 2021-02-28
 * @export
 * @class WechatApp
 */
export class WechatApp implements Send {

    private WX_APP_CORPID: string
    private WX_APP_SECRET: string
    private WX_APP_AGENTID: number
    private WX_APP_USERID?: string
    private ACCESS_TOKEN: string
    /**
     * ACCESS_TOKEN 的过期时间(时间戳)
     *
     * @private
     */
    private expiresTime: number

    constructor(option: WechatAppOption) {
        Debugger('option: %O', option)
        Object.assign(this, option)
        if (!this.WX_APP_CORPID) {
            throw new Error('WX_APP_CORPID 是必须的！')
        }
        if (!this.WX_APP_SECRET) {
            throw new Error('WX_APP_SECRET 是必须的！')
        }
        if (!this.WX_APP_AGENTID) {
            throw new Error('WX_APP_AGENTID 是必须的！')
        }
        if (!this.WX_APP_USERID) {
            warn('未提供 WX_APP_USERID！将使用 "@all" 向全体成员推送')
            this.WX_APP_USERID = '@all'
        }
    }

    private async getAccessToken(): Promise<string> {
        const { data } = await ajax({
            url: 'https://qyapi.weixin.qq.com/cgi-bin/gettoken',
            query: {
                corpid: this.WX_APP_CORPID,
                corpsecret: this.WX_APP_SECRET,
            },
        })
        if (data?.errcode !== 0) { // 出错返回码，为0表示成功，非0表示调用失败
            error(data?.errmsg)
            throw new Error(data?.errmsg || '获取 access_token 失败！')
        }
        const { access_token, expires_in = 7200 } = data
        Debugger('获取 access_token 成功: %s', access_token)
        this.extendexpiresTime(expires_in)
        return access_token
    }
    /**
     * 延长过期时间
     *
     * @author CaoMeiYouRen
     * @date 2021-03-03
     * @private
     * @param expiresIn 延长的秒数
     */
    private extendexpiresTime(expiresIn: number): void {
        this.expiresTime = Date.now() + expiresIn * 1000 // 设置过期时间
    }

    /**
     *
     *
     * @author CaoMeiYouRen
     * @date 2021-02-28
     * @param content 消息内容，最长不超过2048个字节，超过将截断（支持id转译）
     * @returns
     */
    async send(content: string): Promise<AxiosResponse<any>> {
        Debugger('content: %s', content)
        if (!this.ACCESS_TOKEN || Date.now() >= this.expiresTime) {
            this.ACCESS_TOKEN = await this.getAccessToken()
        }
        return ajax({
            url: 'https://qyapi.weixin.qq.com/cgi-bin/message/send',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            query: {
                access_token: this.ACCESS_TOKEN,
            },
            data: {
                touser: this.WX_APP_USERID,
                msgtype: 'text',
                agentid: this.WX_APP_AGENTID,
                text: {
                    content,
                },
            },
        })
    }
}
