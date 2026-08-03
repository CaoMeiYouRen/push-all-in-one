import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/utils/ajax', () => ({
    ajax: vi.fn(),
}))

import { WechatRobot } from './wechat-robot'
import { ajax } from '@/utils/ajax'

const mockedAjax = vi.mocked(ajax)

describe('WechatRobot', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockedAjax.mockResolvedValue({ data: { errcode: 0 }, status: 200, statusText: 'OK', headers: {}, config: {} } as any)
    })

    it('should validate config', () => {
        expect(() => new WechatRobot({ WECHAT_ROBOT_KEY: '' })).toThrow('"WECHAT_ROBOT_KEY" 字段是必须的！')
    })

    it('should send text push request', async () => {
        const wechatRobot = new WechatRobot({ WECHAT_ROBOT_KEY: 'robot-key-123' })
        const result = await wechatRobot.send('测试标题', '测试内容')
        expect(result.data).toEqual({ errcode: 0 })
        const [config] = mockedAjax.mock.calls[0]
        expect(config.url).toBe('https://qyapi.weixin.qq.com/cgi-bin/webhook/send')
        expect(config.method).toBe('POST')
        expect(config.headers).toEqual({
            'Content-Type': 'application/json',
        })
        expect(config.query).toEqual({ key: 'robot-key-123' })
        expect(config.data).toEqual({
            msgtype: 'text',
            text: {
                content: '测试标题\n测试内容',
            },
        })
    })

    it('should use markdown separator', async () => {
        const wechatRobot = new WechatRobot({ WECHAT_ROBOT_KEY: 'robot-key-123' })
        await wechatRobot.send('测试标题', '测试内容', { msgtype: 'markdown' })
        const [config] = mockedAjax.mock.calls[0]
        expect(config.data).toEqual({
            msgtype: 'markdown',
            markdown: {
                content: '测试标题\n\n测试内容',
            },
        })
    })
})
