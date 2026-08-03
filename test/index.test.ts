import should from 'should'
import { ServerChanTurbo, ServerChanV3, Dingtalk, WechatApp, WechatRobot, PushPlus, IGot, Qmsg, XiZhi, PushDeer, CustomEmail, Discord, OneBot, Telegram, Feishu, Ntfy, WxPusher } from '../src/index'
import { ajax } from '../src/utils/ajax'

const env = (key: string): string => process.env[key] || ''

// 真实推送总开关：需显式设置 TEST_E2E=true 才执行真实推送，否则整个套件跳过
const E2E_ENABLED = env('TEST_E2E') === 'true'

describe.skipIf(!E2E_ENABLED)('push-all-in-one e2e 测试', () => {
    it.skipIf(!env('SOCKS_PROXY'))('测试 ajax proxy', async () => {
        // 需要本地代理，未设置 SOCKS_PROXY 环境变量时跳过
        const { status } = await ajax({
            url: 'https://ip.cmyr.ltd/ip',
            method: 'GET',
        })
        should(status).equal(200, 'ajax 返回 status 应该为 200')
    })

    it.skipIf(!env('SERVER_CHAN_TURBO_SENDKEY'))('测试 ServerChanTurbo', async () => {
        // Server酱。官方文档：https://sct.ftqq.com/
        const SCTKEY = env('SERVER_CHAN_TURBO_SENDKEY')
        const serverChanTurbo = new ServerChanTurbo({
            SERVER_CHAN_TURBO_SENDKEY: SCTKEY,
        })
        const { data } = await serverChanTurbo.send('你好', '你好，我很可爱 - 来自Server酱')
        should(data?.code).equal(0, 'ServerChanTurbo 返回 code 应该为 0')
    })

    it.skipIf(!env('SERVER_CHAN_V3_SENDKEY'))('测试 ServerChanV3', async () => {
        // Server酱3。官方文档：https://sc3.ft07.com/doc
        const sendkey = env('SERVER_CHAN_V3_SENDKEY')
        const serverChanV3 = new ServerChanV3({
            SERVER_CHAN_V3_SENDKEY: sendkey,
        })
        const { data } = await serverChanV3.send('你好', '你好，我很可爱 - 来自 Server酱3 ')
        should(data?.code).equal(0, 'Server酱3 返回 code 应该为 0')
    })

    it.skipIf(!env('EMAIL_AUTH_PASS'))('CustomEmail', async () => {
        const customEmail = new CustomEmail({
            EMAIL_TYPE: 'text',
            EMAIL_TO_ADDRESS: env('EMAIL_TO_ADDRESS'),
            EMAIL_AUTH_USER: env('EMAIL_AUTH_USER'),
            EMAIL_AUTH_PASS: env('EMAIL_AUTH_PASS'),
            EMAIL_HOST: env('EMAIL_HOST'),
            EMAIL_PORT: Number(env('EMAIL_PORT')),
        })
        const { data } = await customEmail.send('你好', '你好，我很可爱 - 自定义邮件')
        should(data.response).equal('250 OK: queued as.', 'CustomEmail response 应该为 "250 OK: queued as."')
    })
    it.skipIf(!env('DINGTALK_ACCESS_TOKEN'))('钉钉机器人', async () => {
        // 钉钉机器人。官方文档：https://developers.dingtalk.com/document/app/custom-robot-access
        const ACCESS_TOKEN = env('DINGTALK_ACCESS_TOKEN')
        const SECRET = env('DINGTALK_SECRET')
        const dingtalk = new Dingtalk({
            DINGTALK_ACCESS_TOKEN: ACCESS_TOKEN,
            DINGTALK_SECRET: SECRET,
        })
        const { data } = await dingtalk.send('你好', '你好，我很可爱 - 钉钉机器人', { msgtype: 'markdown' })
        should(data.errcode).equal(0, '钉钉机器人 errcode 应该为 0')
    })

    it.skipIf(!env('WECHAT_ROBOT_KEY'))('企业微信群机器人', async () => {
        // 企业微信群机器人。官方文档：https://work.weixin.qq.com/api/doc/90000/90136/91770
        // 企业微信群机器人的使用需要两人以上加入企业，如果个人使用微信推送建议使用 企业微信应用+微信插件 推送
        const WECHAT_ROBOT_KEY = env('WECHAT_ROBOT_KEY')
        const wechatRobot = new WechatRobot({
            WECHAT_ROBOT_KEY,
        })
        const { data } = await wechatRobot.send('你好，我很可爱 - 企业微信群机器人', '', {
            msgtype: 'text',
        })
        should(data.errcode).equal(0, '企业微信群机器人 errcode 应该为 0')
    })

    it.skipIf(!env('WECHAT_APP_SECRET'))('企业微信应用推送', async () => {
        // 企业微信应用推送，官方文档：https://work.weixin.qq.com/api/doc/90000/90135/90664
        const wechatApp = new WechatApp({
            WECHAT_APP_CORPID: env('WECHAT_APP_CORPID'),
            WECHAT_APP_AGENTID: Number(env('WECHAT_APP_AGENTID')),
            WECHAT_APP_SECRET: env('WECHAT_APP_SECRET'),
        })
        const { data } = await wechatApp.send('你好，我很可爱 - 企业微信应用推送', '', {
            msgtype: 'text',
            touser: '@all',
        })
        should(data.errcode).equal(0, '企业微信应用推送 errcode 应该为 0')
        // const resp = await wechatApp.send('# 你好\n\n你好，我很可爱 - 企业微信应用推送', 'markdown')
        // should(resp.data.errcode).equal(0, '企业微信应用推送 errcode 应该为 0')
    })

    it.skipIf(!env('PUSH_PLUS_TOKEN'))('PushPlus', async () => {
        // pushplus 推送，官方文档：http://pushplus.hxtrip.com/doc/
        const PUSH_PLUS_TOKEN = env('PUSH_PLUS_TOKEN')
        const pushplus = new PushPlus({ PUSH_PLUS_TOKEN })
        const { data } = await pushplus.send('你好', '你好，我很可爱 - PushPlus')
        should(data?.code).equal(200, 'PushPlus 返回 code 应该为 200')
    })

    it.skipIf(!env('I_GOT_KEY'))('iGot', async () => {
        // iGot 推送，官方文档：https://wahao.github.io/Bark-MP-helper
        const I_GOT_KEY = env('I_GOT_KEY')
        const iGot = new IGot({ I_GOT_KEY })
        const { data } = await iGot.send('你好', '你好，我很可爱 - iGot', {
            url: 'https://github.com/CaoMeiYouRen/push-all-in-one',
            topic: 'push-all-in-one',
        })
        should(data?.ret).equal(0, 'iGot 返回 ret 应该为 0')
    })

    it.skipIf(!env('QMSG_KEY'))('Qmsg', async () => {
        const QMSG_KEY = env('QMSG_KEY')
        const qmsg = new Qmsg({ QMSG_KEY })
        const { data } = await qmsg.send('你好，我很可爱 - Qmsg', '', {
            type: 'send',
            qq: env('QMSG_QQ'),
        })
        should(data?.success).equal(true, 'Qmsg 返回 success 应该为 true')
    })

    it.skipIf(!env('XI_ZHI_KEY'))('XiZhi', async () => {
        // 息知 推送，官方文档：https://xz.qqoq.net/#/index
        const XI_ZHI_KEY = env('XI_ZHI_KEY')
        const xiZhi = new XiZhi({ XI_ZHI_KEY })
        const { data } = await xiZhi.send('你好', '你好，我很可爱 - XiZhi')
        should(data?.code).equal(200, 'XiZhi 返回 code 应该为 200')
    })

    it.skipIf(!env('PUSH_DEER_PUSH_KEY'))('PushDeer', async () => {
        // PushDeer 推送，官方文档：https://github.com/easychen/pushdeer
        const PUSH_DEER_PUSH_KEY = env('PUSH_DEER_PUSH_KEY')
        const pushDeer = new PushDeer({ PUSH_DEER_PUSH_KEY })
        const { data } = await pushDeer.send('你好', '你好，我很可爱 - PushDeer', {
            type: 'markdown',
        })
        should(data?.code).equal(0, 'PushDeer 返回 code 应该为 0')
    })

    it.skipIf(!env('DISCORD_WEBHOOK'))('Discord', async () => {
        // Discord Webhook 推送
        const DISCORD_WEBHOOK = env('DISCORD_WEBHOOK')
        const DISCORD_USERNAME = '草梅友仁的 Bot'
        const DISCORD_AVATAR_URL = 'https://cdn.discordapp.com/avatars/1152633906173059124/344ce2ef94c033e3e9a131847a1baece.webp?size=128'
        const discord = new Discord({ DISCORD_WEBHOOK, PROXY_URL: 'http://127.0.0.1:7897' })
        const { status } = await discord.send(`你好，我很可爱 - Discord ![](${DISCORD_AVATAR_URL})`, '', {
            username: DISCORD_USERNAME,
            avatar_url: DISCORD_AVATAR_URL,
        })
        // response data: ''
        should(status).equal(204, 'Discord 返回 status 应该为 204')
    })

    it.skipIf(!env('ONE_BOT_BASE_URL') || !env('ONE_BOT_ACCESS_TOKEN'))('OneBot', async () => {
        const ONE_BOT_BASE_URL = env('ONE_BOT_BASE_URL')
        const ONE_BOT_ACCESS_TOKEN = env('ONE_BOT_ACCESS_TOKEN')
        const oneBot = new OneBot({ ONE_BOT_BASE_URL, ONE_BOT_ACCESS_TOKEN })
        should(OneBot.version).equal(11, 'OneBot 的版本号 应该为 11')
        const { data } = await oneBot.send('你好，我很可爱 - OneBot 11', '', {
            message_type: 'private',
            user_id: Number(env('ONE_BOT_USER_ID')),
        })
        should(data?.status).equal('ok', 'OneBot 返回 status 应该为 "ok"')
        should(data?.retcode).equal(0, 'OneBot 返回 retcode 应该为 0')
    })

    it.skipIf(!env('TELEGRAM_BOT_TOKEN') || !env('SOCKS_PROXY'))('Telegram', async () => {
        // 通过 SOCKS_PROXY 环境变量走代理
        const telegram = new Telegram({
            TELEGRAM_BOT_TOKEN: env('TELEGRAM_BOT_TOKEN'),
            TELEGRAM_CHAT_ID: Number(env('TELEGRAM_CHAT_ID')),
        })
        const { data } = await telegram.send('你好，我很可爱 - Telegram')
        should(data?.ok).equal(true, 'Telegram 返回 ok 应该为 true')
    })

    it.skipIf(!env('TELEGRAM_BOT_TOKEN'))('Telegram', async () => {
        const telegram = new Telegram({
            TELEGRAM_BOT_TOKEN: env('TELEGRAM_BOT_TOKEN'),
            TELEGRAM_CHAT_ID: Number(env('TELEGRAM_CHAT_ID')),
            PROXY_URL: 'socks://127.0.0.1:7897',
        })
        // telegram.proxyUrl = 'socks://127.0.0.1:7897'
        const { data } = await telegram.send('你好，我很可爱 - Telegram')
        should(data?.ok).equal(true, 'Telegram 返回 ok 应该为 true')
    })

    it.skipIf(!env('FEISHU_APP_SECRET'))('飞书', async () => {
        const feishu = new Feishu({
            FEISHU_APP_ID: env('FEISHU_APP_ID'),
            FEISHU_APP_SECRET: env('FEISHU_APP_SECRET'),
        })
        const { data } = await feishu.send('你好，我很可爱 - 飞书', '', {
            receive_id_type: 'open_id',
            receive_id: env('FEISHU_RECEIVE_ID'),
            msg_type: 'text',
        })
        should(data?.code).equal(0, '飞书 返回 code 应该为 0')
    })

    it.skipIf(!env('NTFY_URL') || !env('NTFY_TOPIC'))('Ntfy', async () => {
        const ntfy = new Ntfy({
            NTFY_URL: env('NTFY_URL'),
            NTFY_TOPIC: env('NTFY_TOPIC'),
        })
        const { data } = await ntfy.send('Ntfy - 中文', '你好，我很可爱 - Ntfy', {
        })
        should(data?.id).type('string', 'Ntfy 返回 id 应该为 string')
    })

    it.skipIf(!env('WX_PUSHER_APP_TOKEN'))('WxPusher', async () => {
        const WX_PUSHER_APP_TOKEN = env('WX_PUSHER_APP_TOKEN')
        const WX_PUSHER_UID = env('WX_PUSHER_UID')
        const wxPusher = new WxPusher({
            WX_PUSHER_APP_TOKEN,
            WX_PUSHER_UID,
        })
        const { data } = await wxPusher.send('你好，我很可爱 - WxPusher', '', {})
        should(data?.code).equal(1000, 'WxPusher 返回 code 应该为 1000')
    })
})
