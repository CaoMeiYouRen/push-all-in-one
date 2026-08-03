import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/utils/ajax', () => ({
    ajax: vi.fn(),
}))

import { PushDeer } from './push-deer'
import { ajax } from '@/utils/ajax'

const mockedAjax = vi.mocked(ajax)

describe('PushDeer', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockedAjax.mockResolvedValue({ data: { code: 0 }, status: 200, statusText: 'OK', headers: {}, config: {} } as any)
    })

    it('should validate config', () => {
        expect(() => new PushDeer({ PUSH_DEER_PUSH_KEY: '' })).toThrow('"PUSH_DEER_PUSH_KEY" 字段是必须的！')
    })

    it('should use default endpoint', async () => {
        const pushDeer = new PushDeer({ PUSH_DEER_PUSH_KEY: 'pushdeerkey123' })
        const result = await pushDeer.send('测试标题', '测试内容')
        expect(result.data).toEqual({ code: 0 })
        const [config] = mockedAjax.mock.calls[0]
        expect(config.baseURL).toBe('https://api2.pushdeer.com')
        expect(config.url).toBe('/message/push')
        expect(config.method).toBe('POST')
        expect(config.headers).toEqual({
            'Content-Type': 'application/x-www-form-urlencoded',
        })
        expect(config.data).toEqual({
            text: '测试标题',
            desp: '测试内容',
            pushkey: 'pushdeerkey123',
            type: 'markdown',
        })
    })

    it('should use custom endpoint and type', async () => {
        const pushDeer = new PushDeer({
            PUSH_DEER_PUSH_KEY: 'pushdeerkey123',
            PUSH_DEER_ENDPOINT: 'http://127.0.0.1:8800',
        })
        await pushDeer.send('测试标题', '', { type: 'text' } as any)
        const [config] = mockedAjax.mock.calls[0]
        expect(config.baseURL).toBe('http://127.0.0.1:8800')
        expect((config.data as any).type).toBe('text')
    })
})
