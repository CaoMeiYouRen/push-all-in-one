import { Send } from '../interfaces/send'
import { ajax } from '@/utils/ajax'
import { AxiosResponse } from 'axios'
import debug from 'debug'
import colors from 'colors'
import CryptoJS from 'crypto-js'
import { Message } from './dingtalk/index'

const Debugger = debug('push:dingtalk')

class RobotOption {
    /**
     * 即 access_token
     *
     */
    accessToken?: string
    /**
     * 加签安全秘钥（HmacSHA256）
     *
     */
    secret?: string
}
/**
 * 在 [dingtalk-robot-sdk](https://github.com/ineo6/dingtalk-robot-sdk) 的基础上重构了一下，用法几乎完全一致。
 * 参考文档 [钉钉开放平台 - 自定义机器人接入](https://developers.dingtalk.com/document/app/custom-robot-access)
 *
 * @author CaoMeiYouRen
 * @date 2021-02-27
 * @export
 * @class Dingtalk
 */
export class Dingtalk implements Send {
    private accessToken?: string
    private secret?: string
    private webhook: string = 'https://oapi.dingtalk.com/robot/send'
    constructor(option: RobotOption) {
        Object.assign(this, option)
        if (!this.accessToken) {
            throw new Error('accessToken is required!')
        }
        if (!this.secret) {
            console.warn(colors.yellow('Secret is undefined'))
        }
    }

    private getSign(timeStamp: number) {
        let signStr = ''
        if (this.secret) {
            signStr = CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA256(`${timeStamp}\n${this.secret}`, this.secret))
            Debugger('Sign string is %s, result is %s', `${timeStamp}\n${this.secret}`, signStr)
        }
        return signStr
    }
    /**
     *
     *
     * @author CaoMeiYouRen
     * @date 2021-02-27
     * @param message
     * @returns
     */
    public async send(message: Message): Promise<AxiosResponse<any>> {
        const timestamp = Date.now()
        const sign = this.getSign(timestamp)
        const result = await ajax({
            url: this.webhook,
            query: {
                timestamp,
                sign,
                access_token: this.accessToken,
            },
            data: message.get(),
            headers: {
                'Content-Type': 'application/json',
            },
        })
        Debugger('Result is %s, %s。', result.data.errcode, result.data.errmsg)
        if (result.data.errcode === 310000) {
            console.error('Send Failed:', result.data)
            Debugger('Please check safe config : %O', result.data)
        }
        return result
    }
}
