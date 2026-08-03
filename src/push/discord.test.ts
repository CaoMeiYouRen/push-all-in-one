import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/utils/ajax', () => ({
    ajax: vi.fn(),
}))

import { Discord } from './discord'
import { ajax } from '@/utils/ajax'

const mockedAjax = vi.mocked(ajax)

describe('Discord', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockedAjax.mockResolvedValue({ data: '', status: 204, statusText: 'No Content', headers: {}, config: {} } as any)
    })

    it('should validate config', () => {
        expect(() => new Discord({ DISCORD_WEBHOOK: '' })).toThrow('"DISCORD_WEBHOOK" 字段是必须的！')
    })

    it('should send push request with username and avatar', async () => {
        const discord = new Discord({
            DISCORD_WEBHOOK: 'https://discord.com/api/webhooks/123456/secret-token',
            PROXY_URL: 'http://127.0.0.1:7897',
        })
        const result = await discord.send('测试标题', '测试内容', {
            username: '测试机器人',
            avatar_url: 'https://example.com/avatar.png',
        })
        expect(result.status).toBe(204)
        const [config] = mockedAjax.mock.calls[0]
        expect(config.url).toBe('https://discord.com/api/webhooks/123456/secret-token')
        expect(config.method).toBe('POST')
        expect(config.proxyUrl).toBe('http://127.0.0.1:7897')
        expect(config.data).toEqual({
            username: '测试机器人',
            content: '测试标题\n测试内容',
            avatar_url: 'https://example.com/avatar.png',
        })
    })
})
