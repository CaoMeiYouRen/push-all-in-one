import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/utils/ajax', () => ({
    ajax: vi.fn(),
}))

import { OneBot } from './one-bot'
import { ajax } from '@/utils/ajax'

const mockedAjax = vi.mocked(ajax)

describe('OneBot', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockedAjax.mockResolvedValue({ data: { status: 'ok', retcode: 0 }, status: 200, statusText: 'OK', headers: {}, config: {} } as any)
    })

    it('should validate config', () => {
        expect(() => new OneBot({ ONE_BOT_BASE_URL: '' })).toThrow('"ONE_BOT_BASE_URL" 字段是必须的！')
    })

    it('should validate option', async () => {
        const oneBot = new OneBot({
            ONE_BOT_BASE_URL: 'http://127.0.0.1:5700',
            ONE_BOT_ACCESS_TOKEN: 'token123',
        })
        await expect(oneBot.send('标题', '内容', {} as any)).rejects.toThrow('"message_type" 字段是必须的！')
    })

    it('should throw error when private message without user_id', async () => {
        const oneBot = new OneBot({
            ONE_BOT_BASE_URL: 'http://127.0.0.1:5700',
            ONE_BOT_ACCESS_TOKEN: 'token123',
        })
        await expect(oneBot.send('标题', '内容', { message_type: 'private' } as any)).rejects.toThrow('OneBot 私聊消息类型必须提供 user_id')
    })

    it('should throw error when group message without group_id', async () => {
        const oneBot = new OneBot({
            ONE_BOT_BASE_URL: 'http://127.0.0.1:5700',
            ONE_BOT_ACCESS_TOKEN: 'token123',
        })
        await expect(oneBot.send('标题', '内容', { message_type: 'group' } as any)).rejects.toThrow('OneBot 群聊消息类型必须提供 group_id')
    })

    it('should send private message', async () => {
        const oneBot = new OneBot({
            ONE_BOT_BASE_URL: 'http://127.0.0.1:5700',
            ONE_BOT_ACCESS_TOKEN: 'token123',
        })
        const result = await oneBot.send('测试标题', '测试内容', {
            message_type: 'private',
            user_id: 10001,
        })
        expect(result.data).toEqual({ status: 'ok', retcode: 0 })
        const [config] = mockedAjax.mock.calls[0]
        expect(config.baseURL).toBe('http://127.0.0.1:5700')
        expect(config.url).toBe('/send_msg')
        expect(config.method).toBe('POST')
        expect(config.headers).toEqual({
            'Content-Type': 'application/json',
            Authorization: 'Bearer token123',
        })
        expect(config.data).toEqual({
            auto_escape: false,
            message_type: 'private',
            message: '测试标题\n测试内容',
            user_id: 10001,
        })
    })
})
