import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/utils/ajax', () => ({
    ajax: vi.fn(),
}))

import { WechatApp } from './wechat-app'
import { ajax } from '@/utils/ajax'

const mockedAjax = vi.mocked(ajax)

const wechatAppConfig = {
    WECHAT_APP_CORPID: 'wwcorpid123',
    WECHAT_APP_AGENTID: 1000003,
    WECHAT_APP_SECRET: 'appsecret123',
}

describe('WechatApp', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockedAjax.mockImplementation(async (config: any) => {
            if (config.url.includes('/gettoken')) {
                return { data: { errcode: 0, access_token: 'access-token-abc', expires_in: 7200 }, status: 200, statusText: 'OK', headers: {}, config: {} } as any
            }
            return { data: { errcode: 0, errmsg: 'ok' }, status: 200, statusText: 'OK', headers: {}, config: {} } as any
        })
    })

    it('should validate config', () => {
        expect(() => new WechatApp({ ...wechatAppConfig, WECHAT_APP_CORPID: '' })).toThrow('"WECHAT_APP_CORPID" 字段是必须的！')
    })

    it('should fetch access token on first send', async () => {
        const wechatApp = new WechatApp(wechatAppConfig)
        const result = await wechatApp.send('测试标题', '测试内容')
        expect(result.data).toEqual({ errcode: 0, errmsg: 'ok' })
        expect(mockedAjax).toHaveBeenCalledTimes(2)
        const [tokenConfig] = mockedAjax.mock.calls[0]
        expect(tokenConfig.url).toBe('https://qyapi.weixin.qq.com/cgi-bin/gettoken')
        expect(tokenConfig.query).toEqual({
            corpid: 'wwcorpid123',
            corpsecret: 'appsecret123',
        })
        const [sendConfig] = mockedAjax.mock.calls[1]
        expect(sendConfig.url).toBe('https://qyapi.weixin.qq.com/cgi-bin/message/send')
        expect(sendConfig.headers).toEqual({
            'Content-Type': 'application/json',
        })
        expect(sendConfig.query).toEqual({
            access_token: 'access-token-abc',
        })
        expect(sendConfig.data).toMatchObject({
            touser: '@all',
            msgtype: 'text',
            agentid: 1000003,
            text: {
                content: '测试标题\n测试内容',
            },
        })
    })

    it('should reuse cached access token on second send', async () => {
        const wechatApp = new WechatApp(wechatAppConfig)
        await wechatApp.send('测试标题', '测试内容')
        await wechatApp.send('测试标题2', '测试内容2')
        expect(mockedAjax).toHaveBeenCalledTimes(3)
        const [firstConfig] = mockedAjax.mock.calls[0]
        expect(firstConfig.url).toContain('/gettoken')
    })

    it('should throw error when get token fails', async () => {
        mockedAjax.mockImplementation(async (config: any) => {
            if (config.url.includes('/gettoken')) {
                return { data: { errcode: 40013, errmsg: 'invalid corpid' }, status: 200, statusText: 'OK', headers: {}, config: {} } as any
            }
            return { data: {}, status: 200, statusText: 'OK', headers: {}, config: {} } as any
        })
        const wechatApp = new WechatApp(wechatAppConfig)
        await expect(wechatApp.send('测试标题', '测试内容')).rejects.toThrow('invalid corpid')
    })

    it('should use markdown separator and custom touser', async () => {
        const wechatApp = new WechatApp(wechatAppConfig)
        await wechatApp.send('测试标题', '测试内容', {
            msgtype: 'markdown',
            touser: 'user1',
        })
        const [sendConfig] = mockedAjax.mock.calls[1]
        expect(sendConfig.data).toMatchObject({
            touser: 'user1',
            msgtype: 'markdown',
            markdown: {
                content: '测试标题\n\n测试内容',
            },
        })
    })
})
