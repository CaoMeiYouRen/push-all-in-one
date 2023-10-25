import { AxiosResponse } from 'axios'
import colors from '@colors/colors'
import { ServerChanTurbo, CustomEmail, Dingtalk, WechatRobot, WechatApp, PushPlus, IGot, Qmsg, XiZhi, PushDeer, Discord, OneBot, Telegram, MsgType, TemplateType, CustomEmailType, OneBotMsgType } from '../src'
import { warn } from '../src/utils/helper'

export function info(text: any): void {
    console.info(colors.cyan(text))
}

/**
 *
 * 从环境变量读取配置并批量推送
 * @author CaoMeiYouRen
 * @date 2023-10-25
 * @export
 * @param title
 * @param [desp]
 */
export async function batchPushAllInOne(title: string, desp?: string): Promise<PromiseSettledResult<AxiosResponse<any>>[]> {
    const pushs: Promise<AxiosResponse<any>>[] = []
    if (process.env.SCTKEY) {
        // Server酱。官方文档：https://sct.ftqq.com/
        const serverChanTurbo = new ServerChanTurbo(process.env.SCTKEY)
        pushs.push(serverChanTurbo.send(title, desp))
        info('Server酱·Turbo 已加入推送队列')
    } else {
        info('未配置 Server酱·Turbo，已跳过')
    }

    if (process.env.EMAIL_AUTH_USER && process.env.EMAIL_AUTH_PASS && process.env.EMAIL_HOST && process.env.EMAIL_PORT && process.env.EMAIL_TO_ADDRESS) {
        // 自定义邮件，基于 nodemailer 实现，官方文档: https://github.com/nodemailer/nodemailer
        const customEmail = new CustomEmail({
            EMAIL_TYPE: process.env.EMAIL_TYPE as CustomEmailType,
            EMAIL_TO_ADDRESS: process.env.EMAIL_TO_ADDRESS,
            EMAIL_AUTH_USER: process.env.EMAIL_AUTH_USER,
            EMAIL_AUTH_PASS: process.env.EMAIL_AUTH_PASS,
            EMAIL_HOST: process.env.EMAIL_HOST,
            EMAIL_PORT: Number(process.env.EMAIL_PORT),
        })
        pushs.push(customEmail.send(title, desp) as any)
        info('自定义邮件 已加入推送队列')
    } else {
        info('未配置 自定义邮件，已跳过')
    }

    if (process.env.DINGTALK_ACCESS_TOKEN) {
        // 钉钉机器人。官方文档：https://developers.dingtalk.com/document/app/custom-robot-access
        const dingtalk = new Dingtalk(process.env.DINGTALK_ACCESS_TOKEN, process.env.DINGTALK_SECRET)
        pushs.push(dingtalk.send(title, desp))
        info('钉钉机器人 已加入推送队列')
    } else {
        info('未配置 钉钉机器人，已跳过')
    }

    if (process.env.WX_ROBOT_KEY) {
        // 企业微信群机器人。官方文档：https://work.weixin.qq.com/help?person_id=1&doc_id=13376
        // 企业微信群机器人的使用需要两人以上加入企业，如果个人使用微信推送建议使用 企业微信应用+微信插件 推送
        const wechatRobot = new WechatRobot(process.env.WX_ROBOT_KEY)
        pushs.push(wechatRobot.send(`${title}\n${desp}`, process.env.WX_ROBOT_MSG_TYPE as MsgType))
        info('企业微信群机器人 已加入推送队列')
    } else {
        info('未配置 企业微信群机器人，已跳过')
    }

    if (process.env.WX_APP_CORPID && process.env.WX_APP_AGENTID && process.env.WX_APP_SECRET) {
        // 企业微信应用推送，官方文档：https://work.weixin.qq.com/api/doc/90000/90135/90664
        const wechatApp = new WechatApp({
            WX_APP_CORPID: process.env.WX_APP_CORPID,
            WX_APP_AGENTID: Number(process.env.WX_APP_AGENTID),
            WX_APP_SECRET: process.env.WX_APP_SECRET,
            WX_APP_USERID: process.env.WX_APP_USERID,
        })
        pushs.push(wechatApp.send(`${title}\n${desp}`))
        info('企业微信应用推送 已加入推送队列')
    } else {
        info('未配置 企业微信应用推送，已跳过')
    }

    if (process.env.PUSH_PLUS_TOKEN) {
        // pushplus 推送，官方文档：http://pushplus.hxtrip.com/doc/
        const pushplus = new PushPlus(process.env.PUSH_PLUS_TOKEN)
        pushs.push(pushplus.send(title, desp, process.env.PUSH_PLUS_TEMPLATE_TYPE as TemplateType))
        info('pushplus 推送 已加入推送队列')
    } else {
        info('未配置 pushplus 推送，已跳过')
    }

    if (process.env.I_GOT_KEY) {
        // iGot 推送，官方文档：https://wahao.github.io/Bark-MP-helper
        const iGot = new IGot(process.env.I_GOT_KEY)
        pushs.push(iGot.send(title, desp))
        info('iGot 推送 已加入推送队列')
    } else {
        info('未配置 iGot 推送，已跳过')
    }

    if (process.env.QMSG_KEY) {
        // Qmsg 酱 推送，官方文档：https://qmsg.zendee.cn
        const qmsg = new Qmsg(process.env.QMSG_KEY)
        pushs.push(qmsg.send(title, desp))
        info('Qmsg 推送 已加入推送队列')
    } else {
        info('未配置 Qmsg 推送，已跳过')
    }

    if (process.env.XI_ZHI_KEY) {
        // 息知 推送，官方文档：https://xz.qqoq.net/#/index
        const xiZhi = new XiZhi(process.env.XI_ZHI_KEY)
        pushs.push(xiZhi.send(title, desp))
        info('XiZhi 推送 已加入推送队列')
    } else {
        info('未配置 XiZhi 推送，已跳过')
    }

    if (process.env.PUSH_DEER_PUSH_KEY) {
        // 【推荐】PushDeer 推送，官方文档：https://github.com/easychen/pushdeer
        const pushDeer = new PushDeer(process.env.PUSH_DEER_PUSH_KEY)
        pushs.push(pushDeer.send(title, desp))
        info('PushDeer 推送 已加入推送队列')
    } else {
        info('未配置 PushDeer 推送，已跳过')
    }

    if (process.env.DISCORD_WEBHOOK) {
        // 【推荐】Discord Webhook 推送，官方文档：https://support.discord.com/hc/zh-tw/articles/228383668-%E4%BD%BF%E7%94%A8%E7%B6%B2%E7%B5%A1%E9%89%A4%E6%89%8B-Webhooks-
        const discord = new Discord(process.env.DISCORD_WEBHOOK, process.env.DISCORD_USERNAME)
        pushs.push(discord.send(`${title}\n${desp}`))
        info('Discord 推送 已加入推送队列')
    } else {
        info('未配置 Discord 推送，已跳过')
    }

    if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
        // 【推荐】Telegram Bot 推送。官方文档：https://core.telegram.org/bots/api#making-requests
        const telegram = new Telegram({
            TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
            TELEGRAM_CHAT_ID: Number(process.env.TELEGRAM_CHAT_ID),
        })
        pushs.push(telegram.send(`${title}\n${desp}`))
        info('Telegram 推送 已加入推送队列')
    } else {
        info('未配置 Telegram 推送，已跳过')
    }

    if (process.env.ONE_BOT_BASE_URL && process.env.ONE_BOT_ACCESS_TOKEN) {
        // OneBot 推送。官方文档：https://github.com/botuniverse/onebot-11
        // 本项目实现的版本为 OneBot 11
        // 在 mirai 环境下实现的插件版本可参考：https://github.com/yyuueexxiinngg/onebot-kotlin
        const oneBot = new OneBot(process.env.ONE_BOT_BASE_URL, process.env.ONE_BOT_ACCESS_TOKEN)
        pushs.push(oneBot.send(`${title}\n${desp}`, process.env.ONE_BOT_MSG_TYPE as OneBotMsgType, Number(process.env.ONE_BOT_RECIEVER_ID)))
        info('Discord 推送 已加入推送队列')
    } else {
        info('未配置 Discord 推送，已跳过')
    }

    if (pushs.length === 0) {
        warn('未配置任何推送，请检查推送配置的环境变量！')
        return []
    }

    const results = await Promise.allSettled(pushs)
    const success = results.filter((e) => e.status === 'fulfilled')
    const fail = results.filter((e) => e.status === 'rejected')

    info(`本次共推送 ${results.length} 个，成功 ${success.length} 个，失败 ${fail.length} 个`)

    return results
}
