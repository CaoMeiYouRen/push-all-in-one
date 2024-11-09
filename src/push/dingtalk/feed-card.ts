export interface FeedCardLink {
    title: string
    messageURL: string
    picURL: string
}
/**
 * 订阅卡片消息
 *
 * @author CaoMeiYouRen
 * @date 2024-11-09
 * @export
 * @interface FeedCard
 */
export interface FeedCard {
    msgtype: 'feedCard'
    feedCard: {
        links: FeedCardLink[]
    }
}
