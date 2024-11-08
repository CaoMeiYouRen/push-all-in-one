import debug from 'debug'
import { Send } from '../interfaces/send'
import { ajax } from '@/utils/ajax'
import { SendResponse } from '@/interfaces/response'

const Debugger = debug('push:i-got')

export interface IGotConfig {
    /**
     * 微信搜索小程序“iGot”获取推送key
     */
    I_GOT_KEY: string
}

export interface IGotOption {
    /**
     * 链接； 点开消息后会主动跳转至此地址
     */
    url?: string
    /**
     * 是否自动复制； 为1自动复制
     */
    automaticallyCopy?: number
    /**
     * 紧急消息，为1表示紧急。此消息将置顶在小程序内， 同时会在推送的消息内做一定的特殊标识
     */
    urgent?: number
    /**
     * 需要自动复制的文本内容
     */
    copy?: string
    /**
     * 主题； 订阅链接下有效；对推送内容分类，用户可选择性订阅
     */
    topic?: string
    [key: string]: any
}

export interface IGotResponse {
    /**
     * 状态码； 0为正常
     */
    ret: number
    /**
     * 响应结果
     */
    data: {
        /**
         * 消息记录，后期开放其他接口用
         * */
        id: string
    }
    /**
     * 结果描述
     */
    errMsg: string
}

/**
 * iGot 推送，官方文档：http://hellyw.com
 *
 * @author CaoMeiYouRen
 * @date 2021-03-03
 * @export
 * @class IGot
 */
export class IGot implements Send {

    /**
     * 微信搜索小程序“iGot”获取推送key
     *
     * @private
     */
    private I_GOT_KEY: string
    /**
     * @author CaoMeiYouRen
     * @date 2024-11-08
     * @param config 微信搜索小程序“iGot”获取推送key
     */
    constructor(config: IGotConfig) {
        const { I_GOT_KEY } = config
        this.I_GOT_KEY = I_GOT_KEY
        Debugger('set I_GOT_KEY: "%s"', I_GOT_KEY)
        if (!this.I_GOT_KEY) {
            throw new Error('I_GOT_KEY 是必须的！')
        }
    }
    /**
     *
     *
     * @author CaoMeiYouRen
     * @date 2021-03-03
     * @param title 请求标题
     * @param [content] 请求正文
     * @param [url] 推送携带的url
     * @param [option] 额外选项
     * @returns
     */
    send(title: string, desp?: string, option?: IGotOption): Promise<SendResponse<IGotResponse>> {
        Debugger('title: "%s", desp: "%s", option: "%o"', title, desp, option)
        return ajax({
            url: `https://push.hellyw.com/${this.I_GOT_KEY}`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            data: {
                title,
                content: desp || title,
                automaticallyCopy: 0, // 关闭自动复制
                ...option,
            },
        })
    }

}
