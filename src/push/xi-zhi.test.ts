import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/utils/ajax', () => ({
    ajax: vi.fn(),
}))

import { XiZhi } from './xi-zhi'
import { ajax } from '@/utils/ajax'

const mockedAjax = vi.mocked(ajax)

describe('XiZhi', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockedAjax.mockResolvedValue({ data: { code: 200 }, status: 200, statusText: 'OK', headers: {}, config: {} } as any)
    })

    it('should validate config', () => {
        expect(() => new XiZhi({ XI_ZHI_KEY: '' })).toThrow('"XI_ZHI_KEY" 字段是必须的！')
    })

    it('should send push request', async () => {
        const xiZhi = new XiZhi({ XI_ZHI_KEY: 'XZtestkey123' })
        const result = await xiZhi.send('测试标题', '测试内容')
        expect(result.data).toEqual({ code: 200 })
        expect(mockedAjax).toHaveBeenCalledTimes(1)
        const [config] = mockedAjax.mock.calls[0]
        expect(config.url).toBe('https://xizhi.qqoq.net/XZtestkey123.send')
        expect(config.method).toBe('POST')
        expect(config.headers).toEqual({
            'Content-Type': 'application/json',
        })
        expect(config.data).toEqual({
            title: '测试标题',
            content: '测试内容',
        })
    })
})
