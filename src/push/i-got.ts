import { ajax } from '@/utils/ajax'
import { AxiosResponse } from 'axios'
import debug from 'debug'
import { Send } from '../interfaces/send'

const Debugger = debug('push:i-got')

/**
 * iGot 推送，官方文档：https://wahao.github.io/Bark-MP-helper
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
     *
     * @author CaoMeiYouRen
     * @date 2021-03-03
     * @param I_GOT_KEY 微信搜索小程序“iGot”获取推送key
     */
    constructor(I_GOT_KEY: string) {
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
     * @returns
     */
    send(title: string, content?: string, url?: string): Promise<AxiosResponse<any>> {
        Debugger('title: "%s", content: "%s", url: "%s"', title, content, url)
        return ajax({
            url: `https://push.hellyw.com/${this.I_GOT_KEY}`,
            method: 'POST',
            data: {
                title,
                content: content || title,
                url,
                automaticallyCopy: 0, // 关闭自动复制
            },
        })
    }

}
