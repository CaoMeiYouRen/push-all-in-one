# push-all-in-one

本项目的目标是支持 Server酱、酷推、Bark App、Telegram Bot、钉钉机器人、企业微信机器人、企业微信应用和自定义推送等多种推送方式，目前还在开发中。

## 安装

```sh
npm i push-all-in-one -S
```

## 使用

```ts
import { ServerChanTurbo, CoolPush, Dingtalk, Email } from 'push-all-in-one'

// 官方文档：https://sct.ftqq.com/
const SCTKEY = 'SCTxxxxxxxxxxxxxxxxxxx'
const serverChanTurbo = new ServerChanTurbo(SCTKEY)
serverChanTurbo.send('你好', '你好，我很可爱')

// 官方文档：https://cp.xuthus.cc/
const SKEY = '022bxxxxxxxxxxxxxxxxxx'
const coolPush = new CoolPush(SKEY)
coolPush.send('你好，我很可爱')

// 官方文档：https://developers.dingtalk.com/document/app/custom-robot-access
const ACCESS_TOKEN = 'xxxxxxxxxxxxxxxxxx'
const SECRET = 'SECxxxxxxxxxxxxxxxx'
const dingtalk = new Dingtalk(ACCESS_TOKEN, SECRET)
dingtalk.send('你好', '你好，我很可爱')

// 官方文档：http://doc.berfen.com/1239397
// 如果不提供 BER_KEY 将会使用免费版本进行推送。免费接口有较多限制，请自行斟酌
const email = new Email('xxxxxxx')
email.send({
    title: '你好',
    subtitle: '这是个小标题',
    desp: '你好，我很可爱',
    addressee: '123456@example.com',
})

```

## 关于设计理念

本人比较认同 `Server酱` 的设计理念，即简化使用的流程，用最简单的方法实现推送，因此，在集成推送功能时不会完整的接入所有功能，而是有所取舍，部分我觉得使用较为麻烦的功能将会移除，只保留最核心的推送功能。【如果想用完整版直接用官方sdk就行了】
