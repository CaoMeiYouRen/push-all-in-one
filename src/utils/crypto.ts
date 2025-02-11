import crypto from 'crypto'

/**
 * 生成钉钉签名
 *
 * @author CaoMeiYouRen
 * @date 2024-10-30
 * @export
 * @param timestamp
 * @param suiteTicket
 * @param suiteSecret
 */
export function generateSignature(timestamp: string | number, suiteTicket: string, suiteSecret: crypto.BinaryLike | crypto.KeyObject): string {
    // 创建要签名的字符串
    const stringToSign = `${timestamp}\n${suiteTicket}`

    // 创建 HMAC 实例
    const hmac = crypto.createHmac('sha256', suiteSecret)

    // 更新 HMAC 实例的数据
    hmac.update(stringToSign, 'utf8')

    // 计算 HMAC 签名并进行 Base64 编码
    const signature = hmac.digest('base64')

    return signature
}

export function base64Encode(str: string): string {
    return Buffer.from(str).toString('base64')
}

export function rfc2047Encode(str: string): string {
    return `=?utf-8?B?${base64Encode(str)}?=`
}
