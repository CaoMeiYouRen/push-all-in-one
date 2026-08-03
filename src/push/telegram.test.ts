import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/utils/ajax', () => ({
    ajax: vi.fn(),
}))

import { Telegram } from './telegram'
import { ajax } from '@/utils/ajax'

const mockedAjax = vi.mocked(ajax)

describe('Telegram', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockedAjax.mockResolvedValue({ data: { ok: true }, status: 200, statusText: 'OK', headers: {}, config: {} } as any)
    })

    it('should validate config', () => {
        expect(() => new Telegram({ TELEGRAM_BOT_TOKEN: '', TELEGRAM_CHAT_ID: 0 })).toThrow('"TELEGRAM_BOT_TOKEN" 字段是必须的！')
    })

    it('should send push request', async () => {
        const telegram = new Telegram({
            TELEGRAM_BOT_TOKEN: '123456:ABC-DEF',
            TELEGRAM_CHAT_ID: 10086,
        })
        const result = await telegram.send('测试标题', '测试内容')
        expect(result.data).toEqual({ ok: true })
        const [config] = mockedAjax.mock.calls[0]
        expect(config.url).toBe('https://api.telegram.org/bot123456:ABC-DEF/sendMessage')
        expect(config.method).toBe('POST')
        expect(config.data).toEqual({
            chat_id: 10086,
            text: '测试标题\n测试内容',
        })
    })

    it('should pass proxyUrl from config', async () => {
        const telegram = new Telegram({
            TELEGRAM_BOT_TOKEN: '123456:ABC-DEF',
            TELEGRAM_CHAT_ID: 10086,
            PROXY_URL: 'socks://127.0.0.1:7897',
        })
        await telegram.send('测试标题')
        const [config] = mockedAjax.mock.calls[0]
        expect(config.proxyUrl).toBe('socks://127.0.0.1:7897')
    })
})
