/**
 * 链接消息
 *
 * @author CaoMeiYouRen
 * @date 2024-11-09
 * @export
 * @interface Link
 */
export interface Link {
    msgtype: 'link'
    link: {
        text: string
        title: string
        picUrl?: string
        messageUrl: string
    }
}
