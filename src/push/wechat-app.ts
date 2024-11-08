import debug from 'debug'
import { Send } from '../interfaces/send'
import { error, warn } from '@/utils/helper'
import { ajax } from '@/utils/ajax'
import { SendResponse } from '@/interfaces/response'

const Debugger = debug('push:wechat-app')
export type WechatAppMsgType = 'text' | 'markdown' | 'voice' | 'file' | 'image' | 'voice' | 'video' | 'textcard' | 'news' | 'mpnews' | 'miniprogram_notice' | 'template_card'
export interface WechatAppConfig {
    /**
     * 企业ID，获取方式参考：[术语说明-corpid](https://work.weixin.qq.com/api/doc/90000/90135/91039#14953/corpid)
     *
     */
    WECHAT_APP_CORPID: string
    /**
     * 应用的凭证密钥，获取方式参考：[术语说明-secret](https://work.weixin.qq.com/api/doc/90000/90135/91039#14953/secret)
     *
     */
    WECHAT_APP_SECRET: string
    /**
     * 企业应用的id。企业内部开发，可在应用的设置页面查看
     *
     */
    WECHAT_APP_AGENTID: number
}

export type WechatAppOption = {
    // 消息类型
    msgtype: WechatAppMsgType
    // 表示是否是保密消息，0表示可对外分享，1表示不能
    safe?: 0 | 1
    // 表示是否开启id转译，0表示否，1表示是，默认0。
    enable_id_trans?: 0 | 1
    // 表示是否开启重复消息检查，0表示否，1表示是，默认
    enable_duplicate_check?: 0 | 1
    // 表示是否重复消息检查的时间间隔，默认1800s，最大不超过4小时
    duplicate_check_interval?: number
    [key: string]: any
} & ({
    // 指定接收消息的成员，成员ID列表（多个接收者用‘|’分隔，最多支持1000个）。
    // 特殊情况：指定为"@all"，则向该企业应用的全部成员发送
    touser?: string
} | {
    // 指定接收消息的部门，部门ID列表，多个接收者用‘|’分隔，最多支持100个。
    // 当touser为"@all"时忽略本参数
    toparty?: string
} | {
    // 指定接收消息的标签，标签ID列表，多个接收者用‘|’分隔，最多支持100个。
    // 当touser为"@all"时忽略本参数
    totag?: string
})

export interface WechatAppResponse {
    // 企业微信返回的错误码，为0表示成功，非0表示调用失败
    errcode: number
    errmsg: string
    invaliduser?: string
    invalidparty?: string
    invalidtag?: string
    unlicenseduser?: string
    msgid: string
    response_code?: string
}
/**
 * 企业微信应用推送，文档：https://developer.work.weixin.qq.com/document/path/90664
 *
 * @author CaoMeiYouRen
 * @date 2021-02-28
 * @export
 * @class WechatApp
 */
export class WechatApp implements Send {

    private ACCESS_TOKEN: string

    private WECHAT_APP_CORPID: string
    private WECHAT_APP_SECRET: string
    private WECHAT_APP_AGENTID: number

    /**
     * ACCESS_TOKEN 的过期时间(时间戳)
     *
     * @private
     */
    private expiresTime: number

    constructor(config: WechatAppConfig) {
        Debugger('config: %O', config)
        Object.assign(this, config)
        if (!this.WECHAT_APP_CORPID) {
            throw new Error('WECHAT_APP_CORPID 是必须的！')
        }
        if (!this.WECHAT_APP_SECRET) {
            throw new Error('WECHAT_APP_SECRET 是必须的！')
        }
        if (!this.WECHAT_APP_AGENTID) {
            throw new Error('WECHAT_APP_AGENTID 是必须的！')
        }
    }

    private async getAccessToken(): Promise<string> {
        const { data } = await ajax({
            url: 'https://qyapi.weixin.qq.com/cgi-bin/gettoken',
            query: {
                corpid: this.WECHAT_APP_CORPID,
                corpsecret: this.WECHAT_APP_SECRET,
            },
        })
        if (data?.errcode !== 0) { // 出错返回码，为0表示成功，非0表示调用失败
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
     * 发送消息
     *
     * @author CaoMeiYouRen
     * @date 2024-11-08
     * @param title 消息标题
     * @param [desp] 消息内容，最长不超过2048个字节，超过将截断（支持id转译）
     * @param [option] 额外推送选项
     */
    async send(title: string, desp?: string, option?: WechatAppOption): Promise<SendResponse<WechatAppResponse>> {
        Debugger('title: "%s", desp: "%s", option: %O', title, desp, option)
        if (!this.ACCESS_TOKEN || Date.now() >= this.expiresTime) {
            this.ACCESS_TOKEN = await this.getAccessToken()
        }
        const { msgtype = 'text', touser: _touser, ...args } = option || {}
        if (!_touser) {
            warn('未指定 touser，将使用 "@all" 向全体成员推送')
        }
        const sep = msgtype === 'markdown' ? '\n\n' : '\n'
        const content = `${title}${desp ? `${sep}${desp}` : ''}`
        const touser = _touser || '@all' // 如果没有指定 touser，则使用全体成员
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
                touser,
                msgtype,
                agentid: this.WECHAT_APP_AGENTID,
                [msgtype]: {
                    content,
                },
                ...args,
            },
        })
    }
}
