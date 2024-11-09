/**
 * 钉钉 markdown 消息
 *
 * @author CaoMeiYouRen
 * @date 2024-11-09
 * @export
 * @interface Markdown
 */
export interface Markdown {
    msgtype: 'markdown'
    markdown: {
        title: string
        text: string
    }
    at?: {
        atMobiles?: string[]
        atUserIds?: string[]
        isAtAll?: boolean
    }
}
