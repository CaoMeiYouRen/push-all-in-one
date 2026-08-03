import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/utils/ajax', () => ({
    ajax: vi.fn(),
}))

import { IGot } from './i-got'
import { ajax } from '@/utils/ajax'

const mockedAjax = vi.mocked(ajax)

describe('IGot', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockedAjax.mockResolvedValue({ data: { ret: 0 }, status: 200, statusText: 'OK', headers: {}, config: {} } as any)
    })

    it('should validate config', () => {
        expect(() => new IGot({ I_GOT_KEY: '' })).toThrow('"I_GOT_KEY" 字段是必须的！')
    })

    it('should send push request', async () => {
        const iGot = new IGot({ I_GOT_KEY: 'igotkey123' })
        const result = await iGot.send('测试标题', '测试内容', {
            topic: 'test-topic',
        })
        expect(result.data).toEqual({ ret: 0 })
        const [config] = mockedAjax.mock.calls[0]
        expect(config.url).toBe('https://push.hellyw.com/igotkey123')
        expect(config.method).toBe('POST')
        expect(config.headers).toEqual({
            'Content-Type': 'application/json',
        })
        expect(config.data).toEqual({
            title: '测试标题',
            content: '测试内容',
            automaticallyCopy: 0,
            topic: 'test-topic',
        })
    })

    it('should use title as content when desp is empty', async () => {
        const iGot = new IGot({ I_GOT_KEY: 'igotkey123' })
        await iGot.send('仅标题')
        const [config] = mockedAjax.mock.calls[0]
        expect((config.data as any).content).toBe('仅标题')
    })
})
