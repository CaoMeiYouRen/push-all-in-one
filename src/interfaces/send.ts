import { SendResponse } from './response'

/**
 * 要求所有 push 方法都至少实现了 send 接口
 *
 * @author CaoMeiYouRen
 * @date 2021-02-27
 * @export
 * @interface Send
 */
export interface Send {
    /**
     * 代理地址。支持 http/https/socks/socks5 协议。例如 http://127.0.0.1:8080
     *
     * @author CaoMeiYouRen
     * @date 2024-04-20
     */
    proxyUrl?: string
    /**
     * 发送消息
     *
     * @author CaoMeiYouRen
     * @date 2024-11-09
     * @param title 消息标题
     * @param [desp] 消息描述
     * @param [options] 发送选项
     */
    send(title: string, desp?: string, options?: any): Promise<SendResponse<any>>
}
