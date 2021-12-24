# push-all-in-one

Push All In One！支持 Server酱、酷推、邮件、钉钉机器人、企业微信机器人、企业微信应用、pushplus、iGot 等多种推送方式。

## 温馨提示：

出于安全考虑，**所有**推送方式请在**服务端**使用！请勿在**客户端**使用！

## 安装

```sh
npm i push-all-in-one -S
```

## 使用

```ts
import { ServerChanTurbo, CoolPush, Dingtalk, Email, WechatRobot, WechatApp, PushPlus, IGot } from 'push-all-in-one'

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

// 企业微信群机器人。官方文档：https://work.weixin.qq.com/help?person_id=1&doc_id=13376
// 企业微信群机器人的使用需要两人以上加入企业，如果个人使用微信推送建议使用 企业微信应用+微信插件 推送。虽然需要配置的内容更多了，但是无需下载企业微信，网页端即可完成操作。
const WX_ROBOT_KEY = 'xxxxxxxxxxxxxxxxxxxxxxx'
const wechatRobot = new WechatRobot(WX_ROBOT_KEY)
wechatRobot.send('你好，我很可爱', 'text')

// 企业微信应用推送，官方文档：https://work.weixin.qq.com/api/doc/90000/90135/90664
// 微信插件 https://work.weixin.qq.com/wework_admin/frame#profile/wxPlugin
const wechatApp = new WechatApp({
    WX_APP_CORPID: 'wwxxxxxxxxxxxxxxxxxxxx',
    WX_APP_AGENTID: 10001, // 请更换为自己的 AGENTID 
    WX_APP_SECRET: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    WX_APP_USERID: '@all',
})
wechatApp.send('你好，我很可爱')

// pushplus 推送，官方文档：https://www.pushplus.plus/doc/
const PUSH_PLUS_TOKEN = 'xxxxxxxxxxxxxxxxxxxxx'
const pushplus = new PushPlus(PUSH_PLUS_TOKEN)
pushplus.send('你好', '你好，我很可爱')

// iGot 推送，官方文档：https://wahao.github.io/Bark-MP-helper
const I_GOT_KEY = 'xxxxxxxxxx'
const iGot = new IGot(I_GOT_KEY)
iGot.send('你好', '你好，我很可爱', 'https://github.com/CaoMeiYouRen/push-all-in-one')

```

## 关于设计理念

本人比较认同 `Server酱` 的设计理念，即简化使用的流程，用最简单的方法实现推送。因此，在集成推送功能时不会完整的接入所有功能，而是有所取舍，部分我觉得使用较为麻烦的功能将会移除，只保留最核心的推送功能。【如果想用完整版直接用官方sdk就行了】

## 开发

本项目采用 TypeScript 开发，使用 rollup 打包，可以完美实现类型提示和摇树优化，对于未使用到的模块，会在编译阶段去除。

### debug

本项目使用 `debug` 这个包来 debug ，如果要开启调试则设置环境变量为 `DEBUG=push:*` 即可，例如

```sh
cross-env DEBUG=push:* NODE_ENV=development ts-node-dev test/index.test.ts # 因为一些原因该文件未上传，可自行编写测试用例
```

### 编译

```sh
npm run build
```

