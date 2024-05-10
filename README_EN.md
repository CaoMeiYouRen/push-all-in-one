<p>
    <a href="./README.md">中文</a> | <strong>English</strong>
</p>
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


> Push All In One! Supports multiple push methods such as Server Chan, custom email, DingTalk robot, WeChat Work robot, WeChat Work application, pushplus, iGot, Qmsg, XiZhi, PushDeer, Discord, OneBot, Telegram and more.
>
> Kind reminder: For security reasons,* **all** *push methods should be used on the* **server-side***! Do not use them on the* **client-side (web page)***! Using them on the web page will also cause additional cross-domain issues.


## 🏠 Homepage

[https://github.com/CaoMeiYouRen/push-all-in-one#readme](https://github.com/CaoMeiYouRen/push-all-in-one#readme)

## ✨ Demo

[https://github.com/CaoMeiYouRen/push-all-in-one/tree/master/examples](https://github.com/CaoMeiYouRen/push-all-in-one/tree/master/examples)

## 📦 Dependency Requirements


- node >=12

## 🚀 Installation

```sh
npm i push-all-in-one -S
```

## 👨‍💻 Usage

```ts
import { ServerChanTurbo, CustomEmail, Dingtalk, WechatRobot, WechatApp, PushPlus, IGot, Qmsg, XiZhi, PushDeer, Discord, OneBot, Telegram } from 'push-all-in-one'

// Server Chan. Official documentation: https://sct.ftqq.com/
const SCTKEY = 'SCTxxxxxxxxxxxxxxxxxxx'
const serverChanTurbo = new ServerChanTurbo(SCTKEY)
serverChanTurbo.send('Hello', 'Hello, I am cute')

// [Recommended] Custom email based on nodemailer. Official documentation: https://github.com/nodemailer/nodemailer
const customEmail = new CustomEmail({
    EMAIL_TYPE: 'text',
    EMAIL_TO_ADDRESS: 'xxxxx@qq.com',
    EMAIL_AUTH_USER: 'yyyyy@qq.com',
    EMAIL_AUTH_PASS: '123456',
    EMAIL_HOST: 'smtp.qq.com',
    EMAIL_PORT: 465,
})
customEmail.send('Hello', 'Hello, I am cute - custom email')

// [Recommended] DingTalk robot. Official documentation: https://developers.dingtalk.com/document/app/custom-robot-access
const ACCESS_TOKEN = 'xxxxxxxxxxxxxxxxxx'
const SECRET = 'SECxxxxxxxxxxxxxxxx'
const dingtalk = new Dingtalk(ACCESS_TOKEN, SECRET)
dingtalk.send('Hello', 'Hello, I am cute')

// WeChat Work group robot. Official documentation: https://developer.work.weixin.qq.com/document/path/91770
// The use of WeChat Work group robots requires two or more people to join the enterprise. If you use WeChat push personally, it is recommended to use WeChat Work application + WeChat plug-in push. Although more configuration is required, you do not need to download WeChat Work and can complete the operation on the web page.
const WX_ROBOT_KEY = 'xxxxxxxxxxxxxxxxxxxxxxx'
const wechatRobot = new WechatRobot(WX_ROBOT_KEY)
wechatRobot.send('Hello, I am cute', 'text')

// [Recommended] Enterprise WeChat application push. Official documentation: https://developer.work.weixin.qq.com/document/path/90664
// WeChat plug-in https://work.weixin.qq.com/wework_admin/frame#profile/wxPlugin
// Please refer to the parameter introduction: https://developer.work.weixin.qq.com/document/path/90665
// Supports text and markdown formats, but markdown format can only be viewed in Enterprise WeChat
const wechatApp = new WechatApp({
    WX_APP_CORPID: 'wwxxxxxxxxxxxxxxxxxxxx',
    WX_APP_AGENTID: 10001, // Please replace with your own AGENTID 
    WX_APP_SECRET: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    WX_APP_USERID: '@all',
})
wechatApp.send('Hello, I am cute', 'text')

// pushplus push. Official documentation: https://www.pushplus.plus/doc/
const PUSH_PLUS_TOKEN = 'xxxxxxxxxxxxxxxxxxxxx'
const pushplus = new PushPlus(PUSH_PLUS_TOKEN)
pushplus.send('Hello', 'Hello, I am cute')

// iGot push. Official documentation: https://wahao.github.io/Bark-MP-helper
const I_GOT_KEY = 'xxxxxxxxxx'
const iGot = new IGot(I_GOT_KEY)
iGot.send('Hello', 'Hello, I am cute', 'https://github.com/CaoMeiYouRen/push-all-in-one')

// Qmsg push. Official documentation: https://qmsg.zendee.cn
const QMSG_KEY = 'xxxxxxxxxxxx'
const qmsg = new Qmsg(QMSG_KEY)
qmsg.send('Hello, I am cute - Qmsg', '12345,12346', 'send') // msg：The message content to be pushed; qq：Specify the QQ number or QQ group that will receive the message. Multiple QQ numbers are separated by commas. For example: 12345,12346

// XiZhi push. Official documentation: https://xz.qqoq.net/#/index
const XI_ZHI_KEY = 'xxxxxxxxxxxxx'
const xiZhi = new XiZhi(XI_ZHI_KEY)
xiZhi.send('Hello', 'Hello, I am cute - XiZhi')

// [Recommended] PushDeer push. Official documentation: https://github.com/easychen/pushdeer
const PUSH_DEER_PUSH_KEY = 'xxxxxxxxxx'
const pushDeer = new PushDeer(PUSH_DEER_PUSH_KEY)
pushDeer.send('Hello', 'Hello, I am cute - PushDeer', 'markdown')

// [Recommended] Discord Webhook push. Official documentation: https://support.discord.com/hc/zh-tw/articles/228383668-%E4%BD%BF%E7%94%A8%E7%B6%B2%E7%B5%A1%E9%89%A4%E6%89%8B-Webhooks-
const DISCORD_WEBHOOK = 'https://discord.com/api/webhooks/xxxxxxxxxxxxxxxxxxxxxxxxxxx'
const DISCORD_USERNAME = 'Discord Bot'
const discord = new Discord(DISCORD_WEBHOOK, DISCORD_USERNAME)
discord.send('Hello, I am cute - Discord')

// [Recommended] Telegram Bot push. Official documentation: https://core.telegram.org/bots/api#making-requests
const telegram = new Telegram({
    TELEGRAM_BOT_TOKEN: '111111:xxxxxxxxxxxxxx',
    TELEGRAM_CHAT_ID: 100000,
})
telegram.send('Hello, I am cute - Telegram')

// OneBot push. Official documentation: https://github.com/botuniverse/onebot-11
// The version implemented in this project is OneBot 11
// The plugin version implemented in the mirai environment can be found at: https://github.com/yyuueexxiinngg/onebot-kotlin
const oneBot = new OneBot('http://127.0.0.1:5700', 'xxxxxxxxxxx')
oneBot.send('Hello, I am cute - OneBot 11', 'private', 10001)
```
For more examples, please refer to [examples](https://github.com/CaoMeiYouRen/push-all-in-one/tree/master/examples)

**Proxy support**

| Environment variable | Function                                    | Example                |
| -------------------- | ------------------------------------------- | ---------------------- |
| NO_PROXY             | Set whether to disable the proxy            | true                   |
| HTTP_PROXY           | Set http/https proxy                        | http://127.0.0.1:8101  |
| HTTPS_PROXY          | Set http/https proxy                        | http://127.0.0.1:8101  |
| SOCKS_PROXY          | Set http/https proxy through socks protocol | socks://127.0.0.1:8100 |

This project supports request proxies through environment variables.

```ts
// In nodejs projects, you can set proxies by directly setting environment variables
process.env.HTTP_PROXY = 'http://127.0.0.1:8101' // Use HTTP_PROXY when the request is http/https
process.env.HTTPS_PROXY = 'http://127.0.0.1:8101' // Use HTTPS_PROXY when the request is http/https
process.env.SOCKS_PROXY = 'socks://127.0.0.1:8100' // Use SOCKS_PROXY when neither HTTP_PROXY set
// process.env.NO_PROXY = true // Set NO_PROXY to disable proxies
```

You can manually set environment variables in the command line.

```sh
set HTTP_PROXY='http://127.0.0.1:8101' # Windows
export HTTP_PROXY='http://127.0.0.1:8101' # Linux
cross-env HTTP_PROXY='http://127.0.0.1:8101' # Use the cross-env package to cross platforms
```

## 🛠️  Development

This project is developed using TypeScript and packaged using rollup. It can perfectly achieve type prompts and tree shaking optimization. For unused modules, they will be removed during the compilation phase.

```sh
npm run dev
```

## 🐛 Debug

This project uses the debug package for debugging. If you want to enable debugging, set the environment variable to DEBUG=push:*. For example:

```sh
cross-env DEBUG=push:* NODE_ENV=development ts-node-dev test/index.test.ts # For some reason, this file has not been uploaded. You can write your own test cases.

```

## 🔧 Build

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

## 👤 Author

**CaoMeiYouRen**

* Website: [https://blog.cmyr.ltd/](https://blog.cmyr.ltd/)
* GitHub: [@CaoMeiYouRen](https://github.com/CaoMeiYouRen)

## 🤝 Contribution

Welcome to contribute, ask questions or propose new features! <br />If you have any questions, please check the  [issues page](https://github.com/CaoMeiYouRen/push-all-in-one/issues). <br/> For contributions or new feature proposals, please refer to the [contributing guide](https://github.com/CaoMeiYouRen/push-all-in-one/blob/master/CONTRIBUTING.md).

## 💰 Support

If you find this project useful, please give it a ⭐️. Thank you very much.

<a href="https://afdian.net/@CaoMeiYouRen">
  <img src="https://cdn.jsdelivr.net/gh/CaoMeiYouRen/image-hosting-01@master/images/202306192324870.png" width="312px" height="78px" alt="Support me on Afdian">
</a>

<a href="https://patreon.com/CaoMeiYouRen">
    <img src="https://cdn.jsdelivr.net/gh/CaoMeiYouRen/image-hosting-01@master/images/202306142054108.svg" width="312px" height="78px" alt="Become a patreon"/>
</a>

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=CaoMeiYouRen/push-all-in-one&type=Date)](https://star-history.com/#CaoMeiYouRen/push-all-in-one&Date)

## 📝 License

Copyright © 2022 [CaoMeiYouRen](https://github.com/CaoMeiYouRen).<br />
This project is [MIT](https://github.com/CaoMeiYouRen/push-all-in-one/blob/master/LICENSE) licensed.

***
_This README was generated with ❤️ by [cmyr-template-cli](https://github.com/CaoMeiYouRen/cmyr-template-cli)_
