/**
 * 文本消息
 *
 * @author CaoMeiYouRen
 * @date 2024-11-09
 * @export
 * @interface Text
 */
export interface Text {
    msgtype: 'text'
    text: {
        content: string
    }
    at?: {
        atMobiles?: string[]
        atUserIds?: string[]
        isAtAll?: boolean
    }
}
