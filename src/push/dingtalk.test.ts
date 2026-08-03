import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/utils/ajax', () => ({
    ajax: vi.fn(),
}))

import { Dingtalk } from './dingtalk'
import { ajax } from '@/utils/ajax'

const mockedAjax = vi.mocked(ajax)

describe('Dingtalk', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockedAjax.mockResolvedValue({ data: { errcode: 0, errmsg: 'ok' }, status: 200, statusText: 'OK', headers: {}, config: {} } as any)
    })

    it('should validate config', () => {
        expect(() => new Dingtalk({ DINGTALK_ACCESS_TOKEN: '' })).toThrow('"DINGTALK_ACCESS_TOKEN" 字段是必须的！')
    })

    it('should warn when secret is not provided', () => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => { })
        new Dingtalk({ DINGTALK_ACCESS_TOKEN: 'token123' })
        expect(warnSpy).toHaveBeenCalled()
        warnSpy.mockRestore()
    })

    it('should send text message with signature', async () => {
        const dingtalk = new Dingtalk({
            DINGTALK_ACCESS_TOKEN: 'token123',
            DINGTALK_SECRET: 'SECsecret456',
        })
        const result = await dingtalk.send('测试标题', '测试内容')
        expect(result.data).toEqual({ errcode: 0, errmsg: 'ok' })
        const [config] = mockedAjax.mock.calls[0]
        expect(config.url).toBe('https://oapi.dingtalk.com/robot/send')
        expect(config.method).toBe('POST')
        expect(config.headers).toEqual({
            'Content-Type': 'application/json',
        })
        expect(typeof config.query.timestamp).toBe('number')
        expect(config.query.sign).toBeTruthy()
        expect(config.query.access_token).toBe('token123')
        expect(config.data).toMatchObject({
            msgtype: 'text',
            text: {
                content: '测试标题\n测试内容',
            },
        })
    })

    it('should send markdown message', async () => {
        const dingtalk = new Dingtalk({
            DINGTALK_ACCESS_TOKEN: 'token123',
            DINGTALK_SECRET: 'SECsecret456',
        })
        await dingtalk.send('测试标题', '测试内容', { msgtype: 'markdown' })
        const [config] = mockedAjax.mock.calls[0]
        expect(config.data).toMatchObject({
            msgtype: 'markdown',
            markdown: {
                title: '测试标题',
                text: '# 测试标题\n\n测试内容',
            },
        })
    })

    it('should send link message with default picUrl', async () => {
        const dingtalk = new Dingtalk({
            DINGTALK_ACCESS_TOKEN: 'token123',
            DINGTALK_SECRET: 'SECsecret456',
        })
        await dingtalk.send('测试标题', '测试内容', { msgtype: 'link' } as any)
        const [config] = mockedAjax.mock.calls[0]
        expect(config.data).toMatchObject({
            msgtype: 'link',
            link: {
                title: '测试标题',
                text: '测试内容',
                picUrl: '',
                messageUrl: '',
            },
        })
    })

    it('should send actionCard message', async () => {
        const dingtalk = new Dingtalk({
            DINGTALK_ACCESS_TOKEN: 'token123',
            DINGTALK_SECRET: 'SECsecret456',
        })
        await dingtalk.send('测试标题', '测试内容', {
            msgtype: 'actionCard',
            actionCard: {
                btnOrientation: '1',
                btns: [{ title: '确定', actionURL: 'https://example.com' }],
            },
        } as any)
        const [config] = mockedAjax.mock.calls[0]
        expect(config.data).toMatchObject({
            msgtype: 'actionCard',
            actionCard: {
                btnOrientation: '1',
                btns: [{ title: '确定', actionURL: 'https://example.com' }],
            },
        })
    })

    it('should send feedCard message', async () => {
        const dingtalk = new Dingtalk({
            DINGTALK_ACCESS_TOKEN: 'token123',
            DINGTALK_SECRET: 'SECsecret456',
        })
        await dingtalk.send('测试标题', '测试内容', {
            msgtype: 'feedCard',
            feedCard: {
                links: [{ title: '链接1', messageURL: 'https://example.com', picURL: 'https://example.com/pic.png' }],
            },
        } as any)
        const [config] = mockedAjax.mock.calls[0]
        expect(config.data).toMatchObject({
            msgtype: 'feedCard',
            feedCard: {
                links: [{ title: '链接1', messageURL: 'https://example.com', picURL: 'https://example.com/pic.png' }],
            },
        })
    })

    it('should throw error when msgtype is invalid', async () => {
        const dingtalk = new Dingtalk({
            DINGTALK_ACCESS_TOKEN: 'token123',
            DINGTALK_SECRET: 'SECsecret456',
        })
        await expect(dingtalk.send('测试标题', '测试内容', { msgtype: 'unknown' } as any)).rejects.toThrow('msgtype is required!')
    })
})
