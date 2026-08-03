import { ServerChanTurbo, ServerChanV3, CustomEmail, Dingtalk, WechatRobot, WechatApp, PushPlus, IGot, Qmsg, XiZhi, PushDeer, Discord, OneBot, Telegram } from '../src/index'

// Server酱·Turbo。官方文档：https://sct.ftqq.com/r/13172
const SCTKEY = 'SCTxxxxxxxxxxxxxxxxxxx'
const serverChanTurbo = new ServerChanTurbo({
    SERVER_CHAN_TURBO_SENDKEY: SCTKEY,
})
serverChanTurbo.send('你好', '你好，我很可爱 - Server酱·Turbo', {})

// 【推荐】Server酱³
// Server酱3。官方文档：https://sc3.ft07.com/doc
const SERVER_CHAN_V3_SENDKEY = 'sctpXXXXXXXXXXXXXXXXXXXXXXXX'
const serverChanV3 = new ServerChanV3({
    SERVER_CHAN_V3_SENDKEY,
})
serverChanV3.send('你好', '你好，我很可爱 - Server酱³', {})

// 【推荐】自定义邮件，基于 nodemailer 实现，官方文档: https://github.com/nodemailer/nodemailer
const customEmail = new CustomEmail({
    EMAIL_TYPE: 'text',
    EMAIL_TO_ADDRESS: 'xxxxx@qq.com',
    EMAIL_AUTH_USER: 'yyyyy@qq.com',
    EMAIL_AUTH_PASS: '123456',
    EMAIL_HOST: 'smtp.qq.com',
    EMAIL_PORT: 465,
})
customEmail.send('你好', '你好，我很可爱 - 自定义邮件', {})

// 【推荐】钉钉机器人。官方文档：https://developers.dingtalk.com/document/app/custom-robot-access
const DINGTALK_ACCESS_TOKEN = 'xxxxxxxxxxxxxxxxxx'
const DINGTALK_SECRET = 'SECxxxxxxxxxxxxxxxx'
const dingtalk = new Dingtalk({
    DINGTALK_ACCESS_TOKEN,
    DINGTALK_SECRET,
})
dingtalk.send('你好', '你好，我很可爱 - 钉钉机器人')

// 企业微信群机器人。官方文档：https://developer.work.weixin.qq.com/document/path/91770
// 企业微信群机器人的使用需要两人以上加入企业，如果个人使用微信推送建议使用 企业微信应用+微信插件 推送。虽然需要配置的内容更多了，但是无需下载企业微信，网页端即可完成操作。
const WECHAT_ROBOT_KEY = 'xxxxxxxxxxxxxxxxxxxxxxx'
const wechatRobot = new WechatRobot({
    WECHAT_ROBOT_KEY,
})
wechatRobot.send('你好，我很可爱- 企业微信群机器人', '', { msgtype: 'text' })

// 【推荐】企业微信应用推送，官方文档：https://developer.work.weixin.qq.com/document/path/90664
// 微信插件 https://work.weixin.qq.com/wework_admin/frame#profile/wxPlugin
// 参数的介绍请参考：https://developer.work.weixin.qq.com/document/path/90665
// 支持 text 和 markdown 格式，但 markdown 格式仅可在企业微信中查看
const wechatApp = new WechatApp({
    WECHAT_APP_CORPID: 'wwxxxxxxxxxxxxxxxxxxxx',
    WECHAT_APP_AGENTID: 10001, // 请更换为自己的 AGENTID
    WECHAT_APP_SECRET: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
})
wechatApp.send('你好，我很可爱 - 企业微信应用推送', '', {
    msgtype: 'text',
    touser: '@all',
})

// pushplus 推送，官方文档：https://www.pushplus.plus/doc/
const PUSH_PLUS_TOKEN = 'xxxxxxxxxxxxxxxxxxxxx'
const pushplus = new PushPlus({ PUSH_PLUS_TOKEN })
pushplus.send('你好', '你好，我很可爱 - PushPlus', {
    template: 'html',
    channel: 'wechat',
})

// iGot 推送，官方文档：http://hellyw.com/#/
const I_GOT_KEY = 'xxxxxxxxxx'
const iGot = new IGot({ I_GOT_KEY })
iGot.send('你好', '你好，我很可爱 - iGot', {
    url: 'https://github.com/CaoMeiYouRen/push-all-in-one',
    topic: 'push-all-in-one',
})

// Qmsg 酱 推送，官方文档：https://qmsg.zendee.cn
const QMSG_KEY = 'xxxxxxxxxxxx'
const qmsg = new Qmsg({ QMSG_KEY })
qmsg.send('你好，我很可爱 - Qmsg', '', {
    type: 'send',
    qq: '123456,654321',
}) // msg：要推送的消息内容；qq：指定要接收消息的QQ号或者QQ群，多个以英文逗号分割，例如：12345,12346


// 息知 推送，官方文档：https://xz.qqoq.net/#/index
const XI_ZHI_KEY = 'xxxxxxxxxxxxx'
const xiZhi = new XiZhi({ XI_ZHI_KEY })
xiZhi.send('你好', '你好，我很可爱 - XiZhi')

// PushDeer 推送，官方文档：https://github.com/easychen/pushdeer
const PUSH_DEER_PUSH_KEY = 'xxxxxxxxxx'
const pushDeer = new PushDeer({ PUSH_DEER_PUSH_KEY })
pushDeer.send('你好', '你好，我很可爱 - PushDeer', {
    type: 'markdown',
})

// 【推荐】Discord Webhook 推送，官方文档：https://support.discord.com/hc/zh-tw/articles/228383668-%E4%BD%BF%E7%94%A8%E7%B6%B2%E7%B5%A1%E9%89%A4%E6%89%8B-Webhooks-
const DISCORD_WEBHOOK = 'https://discord.com/api/webhooks/xxxxxxxxxxxxxxxxxxxxxxxxxxx'
const DISCORD_USERNAME = 'My Bot'
const PROXY_URL = 'http://127.0.0.1:8101'
const discord = new Discord({ DISCORD_WEBHOOK, PROXY_URL })
// Discord 也支持以下方式添加代理地址
// discord.proxyUrl = 'http://127.0.0.1:8101'
discord.send('你好，我很可爱 - Discord', '', {
    username: DISCORD_USERNAME,
})

// 【推荐】Telegram Bot 推送。官方文档：https://core.telegram.org/bots/api#making-requests
const telegram = new Telegram({
    TELEGRAM_BOT_TOKEN: '111111:xxxxxxxxxxxxxx',
    TELEGRAM_CHAT_ID: 100000,
    // PROXY_URL: 'http://127.0.0.1:8101',
})
// Telegram 也支持以下方式添加代理地址
// telegram.proxyUrl = 'http://127.0.0.1:8101'
telegram.send('你好，我很可爱 - Telegram', '', {
    disable_notification: true,
})

// OneBot 推送。官方文档：https://github.com/botuniverse/onebot-11
// 本项目实现的版本为 OneBot 11
// 在 mirai 环境下实现的插件版本可参考：https://github.com/yyuueexxiinngg/onebot-kotlin
const ONE_BOT_BASE_URL = 'http://127.0.0.1:5700'
const ONE_BOT_ACCESS_TOKEN = 'xxxxxxxxxxx'
const oneBot = new OneBot({ ONE_BOT_BASE_URL, ONE_BOT_ACCESS_TOKEN })
oneBot.send('你好，我很可爱 - OneBot 11', '', {
    message_type: 'private',
    user_id: 123456789,
})
