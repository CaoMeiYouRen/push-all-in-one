import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/utils/ajax', () => ({
    ajax: vi.fn(),
}))

import { Qmsg } from './qmsg'
import { ajax } from '@/utils/ajax'

const mockedAjax = vi.mocked(ajax)

describe('Qmsg', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockedAjax.mockResolvedValue({ data: { success: true }, status: 200, statusText: 'OK', headers: {}, config: {} } as any)
    })

    it('should validate config', () => {
        expect(() => new Qmsg({ QMSG_KEY: '' })).toThrow('"QMSG_KEY" 字段是必须的！')
    })

    it('should validate option', async () => {
        const qmsg = new Qmsg({ QMSG_KEY: 'qmsgkey123' })
        await expect(qmsg.send('标题', '内容', {} as any)).rejects.toThrow('"type" 字段是必须的！')
    })

    it('should send push request', async () => {
        const qmsg = new Qmsg({ QMSG_KEY: 'qmsgkey123' })
        const result = await qmsg.send('测试标题', '测试内容', {
            type: 'send',
            qq: '123456',
            bot: 'bot1',
        })
        expect(result.data).toEqual({ success: true })
        const [config] = mockedAjax.mock.calls[0]
        expect(config.url).toBe('https://qmsg.zendee.cn/send/qmsgkey123')
        expect(config.method).toBe('POST')
        expect(config.headers).toEqual({
            'Content-Type': 'application/x-www-form-urlencoded',
        })
        expect(config.data).toEqual({
            msg: '测试标题\n测试内容',
            qq: '123456',
            bot: 'bot1',
        })
    })

    it('should use group type url', async () => {
        const qmsg = new Qmsg({ QMSG_KEY: 'qmsgkey123' })
        await qmsg.send('测试标题', '', { type: 'group', qq: '123456' })
        const [config] = mockedAjax.mock.calls[0]
        expect(config.url).toBe('https://qmsg.zendee.cn/group/qmsgkey123')
        expect((config.data as any).msg).toBe('测试标题')
    })
})
