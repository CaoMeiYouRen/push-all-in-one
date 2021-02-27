# push-all-in-one

本项目的目标是支持 Server酱、酷推、Bark App、Telegram Bot、钉钉机器人、企业微信机器人、企业微信应用和自定义推送等多种推送方式，目前还在开发中。

## 安装

```sh
npm i push-all-in-one -S
```

## 使用

```ts
import { ServerChanTurbo, CoolPush, Dingtalk, Text } from 'push-all-in-one'

const SCTKEY = 'SCTxxxxxxxxxxxxxxxxxxx'
const serverChanTurbo = new ServerChanTurbo(SCTKEY)
serverChanTurbo.send('你好', '你好，我很可爱')

const SKEY = '022bxxxxxxxxxxxxxxxxxx'
const coolPush = new CoolPush(SKEY)
coolPush.send('你好，我很可爱')

const dingtalk = new Dingtalk({
    accessToken: 'xxxxxxxxxxxxxx',
    secret: 'SECxxxxxxxxxxxxxxxx',
})
const text = new Text('我就是我,  @1825718XXXX 是不一样的烟火')
text.atPhone('1825718XXXX')
dingtalk.send(text)
// Dingtalk 相关更多请参考 https://github.com/CaoMeiYouRen/ts-dingtalk-robot

```

