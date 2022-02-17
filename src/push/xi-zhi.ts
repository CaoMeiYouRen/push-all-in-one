import { AxiosResponse } from 'axios'
import debug from 'debug'
import { Send } from '../interfaces/send'
import { ajax } from '@/utils/ajax'

const Debugger = debug('push:xi-zhi')

/**
 * 息知 推送，官方文档：https://xz.qqoq.net/#/index
 *
 * @author CaoMeiYouRen
 * @date 2022-02-18
 * @export
 * @class XiZhi
 */
export class XiZhi implements Send {
    private XI_ZHI_KEY: string

    constructor(XI_ZHI_KEY: string) {
        this.XI_ZHI_KEY = XI_ZHI_KEY
        Debugger('set XI_ZHI_KEY: "%s"', XI_ZHI_KEY)
        if (!this.XI_ZHI_KEY) {
            throw new Error('XI_ZHI_KEY 是必须的！')
        }
    }
    async send(title: string, content: string = ''): Promise<AxiosResponse<any>> {
        Debugger('title: "%s", content: "%s"', title, content)
        return ajax({
            url: `https://xizhi.qqoq.net/${this.XI_ZHI_KEY}.send`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            data: {
                title,
                content,
            },
        })
    }
}
