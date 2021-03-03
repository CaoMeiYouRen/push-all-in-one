import { ajax } from '@/utils/ajax'
import { warn } from '@/utils/helper'
import { AxiosResponse } from 'axios'
import debug from 'debug'
import { Send } from '../interfaces/send'

const Debugger = debug('push:email')

type EmailSendOption = {
    /**
     * 发件标题
     *
     */
    title: string
    /**
     * 发件人名称，俗称小标题
     *
     */
    subtitle?: string
    /**
     * 	发件内容（可以是html代码格式）
     *
     */
    desp: string
    /**
     * 收件人邮箱（邮箱地址必须正确）
     *
     */
    addressee: string
}
/**
 * 文档：http://doc.berfen.com/1239397
 *
 * @author CaoMeiYouRen
 * @date 2021-02-28
 * @export
 * @class Email
 *
 */
export class Email implements Send {
    /**
     * 请前往 https://email.berfen.com/ 注册后领取
     *
     * @private
     */
    private BER_KEY?: string

    /**
     *
     * @author CaoMeiYouRen
     * @date 2021-02-28
     * @param BER_KEY 请前往 https://email.berfen.com/ 注册后领取
     */
    constructor(BER_KEY?: string) {
        this.BER_KEY = BER_KEY
        Debugger('set BER_KEY: "%s"', BER_KEY)
        if (!this.BER_KEY) {
            warn('未提供 BER_KEY！将使用免费版本进行推送！官方文档：http://doc.berfen.com/1239397')
        }
    }

    async send(option: EmailSendOption): Promise<AxiosResponse<any>> {
        const { title, subtitle, desp, addressee } = option
        Debugger('option: %O', option)
        if (!addressee) {
            throw new Error('addressee(收件人邮箱) 地址必须正确')
        }
        const free = 'https://email.berfen.com/api'
        const pay = `https://email.berfen.com/api/dz/${this.BER_KEY}/`
        const url = this.BER_KEY ? pay : free
        return ajax({
            url,
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            data: {
                title,
                x_title: subtitle,
                text: desp,
                to: addressee,
            },
        })
    }
}
