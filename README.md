<h1 align="center">push-all-in-one </h1>
<p>
  <a href="https://www.npmjs.com/package/push-all-in-one" target="_blank">
    <img alt="Version" src="https://img.shields.io/npm/v/push-all-in-one.svg">
  </a>
  <a href="https://github.com/CaoMeiYouRen/push-all-in-one/actions?query=workflow%3ARelease" target="_blank">
    <img alt="GitHub Workflow Status" src="https://img.shields.io/github/workflow/status/CaoMeiYouRen/push-all-in-one/Release">
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

> Push All In One！支持 Server酱、酷推、邮件、钉钉机器人、企业微信机器人、企业微信应用、pushplus、iGot 、Qmsg、息知、PushDeer 等多种推送方式。
>
> 温馨提示：出于安全考虑， **所有** 推送方式请在 **服务端** 使用！请勿在 **客户端(网页端)** 使用！网页端使用还将额外产生跨域问题。


### 🏠 [主页](https://github.com/CaoMeiYouRen/push-all-in-one#readme)

[https://github.com/CaoMeiYouRen/push-all-in-one#readme](https://github.com/CaoMeiYouRen/push-all-in-one#readme)


### ✨ [Demo](https://github.com/CaoMeiYouRen/push-all-in-one#readme)

[https://github.com/CaoMeiYouRen/push-all-in-one#readme](https://github.com/CaoMeiYouRen/push-all-in-one#readme)


## 依赖要求


- node >=12

## 安装

```sh
npm i push-all-in-one -S
```

## 使用

```ts
import { ServerChanTurbo, CoolPush, Dingtalk, Email, WechatRobot, WechatApp, PushPlus, IGot, Qmsg, XiZhi, PushDeer } from 'push-all-in-one'

// Server酱。官方文档：https://sct.ftqq.com/
const SCTKEY = 'SCTxxxxxxxxxxxxxxxxxxx'
const serverChanTurbo = new ServerChanTurbo(SCTKEY)
serverChanTurbo.send('你好', '你好，我很可爱')

// 酷推。官方文档：https://cp.xuthus.cc/
const SKEY = '022bxxxxxxxxxxxxxxxxxx'
const coolPush = new CoolPush(SKEY)
coolPush.send('你好，我很可爱', 'send')

// BER分邮件系统。官方文档：http://doc.berfen.com/1239397
// 如果不提供 BER_KEY 将会使用免费版本进行推送。免费接口有较多限制，请自行斟酌
const email = new Email('xxxxxxx')
email.send({
    title: '你好',
    subtitle: '这是个小标题',
    desp: '你好，我很可爱',
    address: '123456@example.com',
})

// 钉钉机器人。官方文档：https://developers.dingtalk.com/document/app/custom-robot-access
const ACCESS_TOKEN = 'xxxxxxxxxxxxxxxxxx'
const SECRET = 'SECxxxxxxxxxxxxxxxx'
const dingtalk = new Dingtalk(ACCESS_TOKEN, SECRET)
dingtalk.send('你好', '你好，我很可爱')

// 企业微信群机器人。官方文档：https://developer.work.weixin.qq.com/document/path/91770
// 企业微信群机器人的使用需要两人以上加入企业，如果个人使用微信推送建议使用 企业微信应用+微信插件 推送。虽然需要配置的内容更多了，但是无需下载企业微信，网页端即可完成操作。
const WX_ROBOT_KEY = 'xxxxxxxxxxxxxxxxxxxxxxx'
const wechatRobot = new WechatRobot(WX_ROBOT_KEY)
wechatRobot.send('你好，我很可爱', 'text')

// 企业微信应用推送，官方文档：https://work.weixin.qq.com/api/doc/90000/90135/90664
// 微信插件 https://work.weixin.qq.com/wework_admin/frame#profile/wxPlugin
// 参数的介绍请参考：https://developer.work.weixin.qq.com/document/path/90665
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

// Qmsg 酱 推送，官方文档：https://qmsg.zendee.cn/api.html
const QMSG_KEY = 'xxxxxxxxxxxx'
const qmsg = new Qmsg(QMSG_KEY)
qmsg.send('你好，我很可爱 - Qmsg', '12345,12346', 'send') // msg：要推送的消息内容；qq：指定要接收消息的QQ号或者QQ群，多个以英文逗号分割，例如：12345,12346


// 息知 推送，官方文档：https://xz.qqoq.net/#/index
const XI_ZHI_KEY = 'xxxxxxxxxxxxx'
const xiZhi = new XiZhi(XI_ZHI_KEY)
xiZhi.send('你好', '你好，我很可爱 - XiZhi')

// PushDeer 推送，官方文档：https://github.com/easychen/pushdeer
const PUSH_DEER_PUSH_KEY = 'xxxxxxxxxx'
const pushDeer = new PushDeer(PUSH_DEER_PUSH_KEY)
pushDeer.send('你好', '你好，我很可爱 - PushDeer', 'markdown')
```

## 开发

本项目采用 TypeScript 开发，使用 rollup 打包，可以完美实现类型提示和摇树优化，对于未使用到的模块，会在编译阶段去除。

```sh
npm run dev
```

## debug

本项目使用 `debug` 这个包来 debug ，如果要开启调试则设置环境变量为 `DEBUG=push:*` 即可，例如

```sh
cross-env DEBUG=push:* NODE_ENV=development ts-node-dev test/index.test.ts # 因为一些原因该文件未上传，可自行编写测试用例
```

## 编译

```sh
npm run build
```

## Lint

```sh
npm run lint
```

## Commit

```sh
npm run commit
```


## 作者


👤 **CaoMeiYouRen**

* Website: [https://blog.cmyr.ltd/](https://blog.cmyr.ltd/)
* GitHub: [@CaoMeiYouRen](https://github.com/CaoMeiYouRen)


## 🤝贡献

欢迎 贡献、提问或提出新功能！<br />如有问题请查看 [issues page](https://github.com/CaoMeiYouRen/push-all-in-one/issues). <br/>贡献或提出新功能可以查看[contributing guide](https://github.com/CaoMeiYouRen/push-all-in-one/blob/master/CONTRIBUTING.md).

## 💰支持

如果觉得这个项目有用的话请给一颗⭐️，非常感谢

## 📝 License

Copyright © 2022 [CaoMeiYouRen](https://github.com/CaoMeiYouRen).<br />
This project is [MIT](https://github.com/CaoMeiYouRen/push-all-in-one/blob/master/LICENSE) licensed.

***
_This README was generated with ❤️ by [cmyr-template-cli](https://github.com/CaoMeiYouRen/cmyr-template-cli)_
