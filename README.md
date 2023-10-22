<h1 align="center">push-all-in-one </h1>
<p>
  <a href="https://www.npmjs.com/package/push-all-in-one" target="_blank">
    <img alt="Version" src="https://img.shields.io/npm/v/push-all-in-one.svg">
  </a>
  <a href="https://github.com/CaoMeiYouRen/push-all-in-one/actions?query=workflow%3ARelease" target="_blank">
    <img alt="GitHub Workflow Status" src="https://img.shields.io/github/actions/workflow/status/CaoMeiYouRen/push-all-in-one/release.yml?branch=master">
  </a>
  <img src="https://img.shields.io/badge/node-%3E%3D12-blue.svg" />
  <a href="https://github.com/CaoMeiYouRen/push-all-in-one#readme" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" />
  </a>
  <a href="https://github.com/CaoMeiYouRen/push-all-in-one/graphs/commit-activity" target="_blank">
    <img alt="Maintenance" src="https://img.shields.io/badge/Maintained%3F-yes-green.svg" />
  </a>
  <a href="https://github.com/CaoMeiYouRen/push-all-in-one/blob/master/LICENSE" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  </a>
</p>

> Push All In One！支持 Server 酱、自定义邮件、钉钉机器人、企业微信机器人、企业微信应用、pushplus、iGot 、Qmsg、息知、PushDeer、Discord、OneBot、Telegram 等多种推送方式。
>
> 温馨提示：出于安全考虑， **所有** 推送方式请在 **服务端** 使用！请勿在 **客户端(网页端)** 使用！网页端使用还将额外产生跨域问题。

## 🏠 [主页](https://github.com/CaoMeiYouRen/push-all-in-one#readme)

[https://github.com/CaoMeiYouRen/push-all-in-one#readme](https://github.com/CaoMeiYouRen/push-all-in-one#readme)


## ✨ [Demo](https://github.com/CaoMeiYouRen/push-all-in-one#readme)

[https://github.com/CaoMeiYouRen/push-all-in-one#readme](https://github.com/CaoMeiYouRen/push-all-in-one#readme)

## 📦 依赖要求


- node >=12

## 🚀 安装

```sh
npm i push-all-in-one -S
```

## 👨‍💻 使用

```ts
import { ServerChanTurbo, CustomEmail, Dingtalk, WechatRobot, WechatApp, PushPlus, IGot, Qmsg, XiZhi, PushDeer, Discord, OneBot, Telegram } from 'push-all-in-one'

// Server酱。官方文档：https://sct.ftqq.com/
const SCTKEY = 'SCTxxxxxxxxxxxxxxxxxxx'
const serverChanTurbo = new ServerChanTurbo(SCTKEY)
serverChanTurbo.send('你好', '你好，我很可爱')

// 【推荐】自定义邮件，基于 nodemailer 实现，官方文档: https://github.com/nodemailer/nodemailer
const customEmail = new CustomEmail({
    EMAIL_TYPE: 'text',
    EMAIL_TO_ADDRESS: 'xxxxx@qq.com',
    EMAIL_AUTH_USER: 'yyyyy@qq.com',
    EMAIL_AUTH_PASS: '123456',
    EMAIL_HOST: 'smtp.qq.com',
    EMAIL_PORT: 465,
})
customEmail.send('你好', '你好，我很可爱 - 自定义邮件')

// 【推荐】钉钉机器人。官方文档：https://developers.dingtalk.com/document/app/custom-robot-access
const ACCESS_TOKEN = 'xxxxxxxxxxxxxxxxxx'
const SECRET = 'SECxxxxxxxxxxxxxxxx'
const dingtalk = new Dingtalk(ACCESS_TOKEN, SECRET)
dingtalk.send('你好', '你好，我很可爱')

// 企业微信群机器人。官方文档：https://developer.work.weixin.qq.com/document/path/91770
// 企业微信群机器人的使用需要两人以上加入企业，如果个人使用微信推送建议使用 企业微信应用+微信插件 推送。虽然需要配置的内容更多了，但是无需下载企业微信，网页端即可完成操作。
const WX_ROBOT_KEY = 'xxxxxxxxxxxxxxxxxxxxxxx'
const wechatRobot = new WechatRobot(WX_ROBOT_KEY)
wechatRobot.send('你好，我很可爱', 'text')

// 【推荐】企业微信应用推送，官方文档：https://developer.work.weixin.qq.com/document/path/90664
// 微信插件 https://work.weixin.qq.com/wework_admin/frame#profile/wxPlugin
// 参数的介绍请参考：https://developer.work.weixin.qq.com/document/path/90665
// 支持 text 和 markdown 格式，但 markdown 格式仅可在企业微信中查看
const wechatApp = new WechatApp({
    WX_APP_CORPID: 'wwxxxxxxxxxxxxxxxxxxxx',
    WX_APP_AGENTID: 10001, // 请更换为自己的 AGENTID 
    WX_APP_SECRET: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    WX_APP_USERID: '@all',
})
wechatApp.send('你好，我很可爱', 'text')

// pushplus 推送，官方文档：https://www.pushplus.plus/doc/
const PUSH_PLUS_TOKEN = 'xxxxxxxxxxxxxxxxxxxxx'
const pushplus = new PushPlus(PUSH_PLUS_TOKEN)
pushplus.send('你好', '你好，我很可爱')

// iGot 推送，官方文档：https://wahao.github.io/Bark-MP-helper
const I_GOT_KEY = 'xxxxxxxxxx'
const iGot = new IGot(I_GOT_KEY)
iGot.send('你好', '你好，我很可爱', 'https://github.com/CaoMeiYouRen/push-all-in-one')

// Qmsg 酱 推送，官方文档：https://qmsg.zendee.cn
const QMSG_KEY = 'xxxxxxxxxxxx'
const qmsg = new Qmsg(QMSG_KEY)
qmsg.send('你好，我很可爱 - Qmsg', '12345,12346', 'send') // msg：要推送的消息内容；qq：指定要接收消息的QQ号或者QQ群，多个以英文逗号分割，例如：12345,12346


// 息知 推送，官方文档：https://xz.qqoq.net/#/index
const XI_ZHI_KEY = 'xxxxxxxxxxxxx'
const xiZhi = new XiZhi(XI_ZHI_KEY)
xiZhi.send('你好', '你好，我很可爱 - XiZhi')

// 【推荐】PushDeer 推送，官方文档：https://github.com/easychen/pushdeer
const PUSH_DEER_PUSH_KEY = 'xxxxxxxxxx'
const pushDeer = new PushDeer(PUSH_DEER_PUSH_KEY)
pushDeer.send('你好', '你好，我很可爱 - PushDeer', 'markdown')

// Discord Webhook 推送，官方文档：https://support.discord.com/hc/zh-tw/articles/228383668-%E4%BD%BF%E7%94%A8%E7%B6%B2%E7%B5%A1%E9%89%A4%E6%89%8B-Webhooks-
const DISCORD_WEBHOOK = 'https://discord.com/api/webhooks/xxxxxxxxxxxxxxxxxxxxxxxxxxx'
const DISCORD_USERNAME = 'Discord Bot'
const discord = new Discord(DISCORD_WEBHOOK, DISCORD_USERNAME)
discord.send('你好，我很可爱 - Discord')

// Telegram Bot 推送。官方文档：https://core.telegram.org/bots/api#making-requests
const telegram = new Telegram({
    TELEGRAM_BOT_TOKEN: '111111:xxxxxxxxxxxxxx',
    TELEGRAM_CHAT_ID: 100000,
})
telegram.send('你好，我很可爱 - Telegram')

// OneBot 推送。官方文档：https://github.com/botuniverse/onebot-11
// 本项目实现的版本为 OneBot 11
// 在 mirai 环境下实现的插件版本可参考：https://github.com/yyuueexxiinngg/onebot-kotlin
const oneBot = new OneBot('http://127.0.0.1:5700', 'xxxxxxxxxxx')
oneBot.send('你好，我很可爱 - OneBot 11', 'private', 10001)
```

**代理支持**

| 环境变量    | 作用                                | 例子                   |
|-------------|-------------------------------------|------------------------|
| NO_PROXY    | 设置是否禁用代理                    | true                   |
| HTTP_PROXY  | 设置 http 代理                      | http://127.0.0.1:8101  |
| HTTPS_PROXY | 设置 https 代理                     | http://127.0.0.1:8101  |
| SOCKS_PROXY | 通过 socks 协议设置 http/https 代理 | socks://127.0.0.1:8100 |

本项目通过环境变量来支持请求代理

```ts
// 在 nodejs 项目中可通过直接设置环境变量来设置代理
process.env.HTTP_PROXY = 'http://127.0.0.1:8101' // 当请求是 http 的时候走 HTTP_PROXY
process.env.HTTPS_PROXY = 'http://127.0.0.1:8101' // 当请求是 https 的时候走 HTTPS_PROXY
process.env.SOCKS_PROXY = 'socks://127.0.0.1:8100' // 当 HTTP_PROXY 和 HTTPS_PROXY 均未设置时走 SOCKS_PROXY
// process.env.NO_PROXY = true // 设置 NO_PROXY 可禁用代理
```

在命令行中可手动设置环境变量

```sh
set HTTPS_PROXY='http://127.0.0.1:8101' # Windows
export HTTPS_PROXY='http://127.0.0.1:8101' # Linux
cross-env HTTPS_PROXY='http://127.0.0.1:8101' # 通过 cross-env 这个包来跨平台
```

## 🛠️ 开发

本项目采用 TypeScript 开发，使用 rollup 打包，可以完美实现类型提示和摇树优化，对于未使用到的模块，会在编译阶段去除。

```sh
npm run dev
```

## 🐛 debug

本项目使用 `debug` 这个包来 debug ，如果要开启调试则设置环境变量为 `DEBUG=push:*` 即可，例如

```sh
cross-env DEBUG=push:* NODE_ENV=development ts-node-dev test/index.test.ts # 因为一些原因该文件未上传，可自行编写测试用例
```

## 🔧 编译

```sh
npm run build
```

## 🔍 Lint

```sh
npm run lint
```

## 💾 Commit

```sh
npm run commit
```

## 👤 作者

**CaoMeiYouRen**

* Website: [https://blog.cmyr.ltd/](https://blog.cmyr.ltd/)
* GitHub: [@CaoMeiYouRen](https://github.com/CaoMeiYouRen)

## 🤝 贡献

欢迎 贡献、提问或提出新功能！<br />如有问题请查看 [issues page](https://github.com/CaoMeiYouRen/push-all-in-one/issues). <br/>贡献或提出新功能可以查看[contributing guide](https://github.com/CaoMeiYouRen/push-all-in-one/blob/master/CONTRIBUTING.md).

## 💰 支持

如果觉得这个项目有用的话请给一颗⭐️，非常感谢

<a href="https://afdian.net/@CaoMeiYouRen">
  <img src="https://cdn.jsdelivr.net/gh/CaoMeiYouRen/image-hosting-01@master/images/202306192324870.png" width="312px" height="78px" alt="在爱发电支持我">
</a>

<a href="https://patreon.com/CaoMeiYouRen">
    <img src="https://cdn.jsdelivr.net/gh/CaoMeiYouRen/image-hosting-01@master/images/202306142054108.svg" width="312px" height="78px" alt="become a patreon"/>
</a>

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=CaoMeiYouRen/push-all-in-one&type=Date)](https://star-history.com/#CaoMeiYouRen/push-all-in-one&Date)

## 📝 License

Copyright © 2022 [CaoMeiYouRen](https://github.com/CaoMeiYouRen).<br />
This project is [MIT](https://github.com/CaoMeiYouRen/push-all-in-one/blob/master/LICENSE) licensed.

***
_This README was generated with ❤️ by [cmyr-template-cli](https://github.com/CaoMeiYouRen/cmyr-template-cli)_
