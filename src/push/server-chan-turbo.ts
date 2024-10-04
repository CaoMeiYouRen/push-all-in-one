import { AxiosResponse } from 'axios'
import debug from 'debug'
import { Send } from '@/interfaces/send'
import { ajax } from '@/utils/ajax'

const Debugger = debug('push:server-chan-turbo')

export type ChannelValue = 98 | 66 | 1 | 2 | 3 | 8 | 0 | 88 | 18 | 9

export type Channel = `${ChannelValue}` | `${ChannelValue}|${ChannelValue}`

/**
 * 附加参数
 */
export type ServerChanTurboOptions = {
    /**
     *  消息卡片内容，选填。最大长度 64。如果不指定，将自动从 desp 中截取生成。
     */
    short?: string
    /**
     * 是否隐藏调用 IP，选填。如果不指定，则显示；为 1 则隐藏。
     */
    noip?: '1' | 1 | true
    /**
     * 动态指定本次推送使用的消息通道，选填。如不指定，则使用网站上的消息通道页面设置的通道。支持最多两个通道，多个通道值用竖线 "|" 隔开。
     * 通道对应的值如下：
     * 官方Android版·β=98
     * 企业微信应用消息=66
     * 企业微信群机器人=1
     * 钉钉群机器人=2
     * 飞书群机器人=3
     * Bark iOS=8
     * 测试号=0
     * 自定义=88
     * PushDeer=18
     * 方糖服务号=9
     */
    channel?: Channel
    /**
     * 消息抄送的 openid，选填。只支持测试号和企业微信应用消息通道。多个 openid 用 "," 隔开。企业微信应用消息通道的 openid 参数，内容为接收人在企业微信中的 UID，多个人请 "|" 隔开。
     */
    openid?: string
}

/**
 * Server 酱·Turbo
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
    async send(text: string, desp: string = '', options: ServerChanTurboOptions = {}): Promise<AxiosResponse<any>> {
        Debugger('text: "%s", desp: "%s", options: %O', text, desp, options)
        if (options.noip === 1 || options.noip === true) {
            options.noip = '1'
        }
        const data = {
            text,
            desp,
            ...options,
        }
        return ajax({
            url: `https://sctapi.ftqq.com/${this.SCTKEY}.send`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            data,
        })
    }
}
