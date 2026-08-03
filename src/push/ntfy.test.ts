import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/utils/ajax', () => ({
    ajax: vi.fn(),
}))

import { Ntfy } from './ntfy'
import { ajax } from '@/utils/ajax'

const mockedAjax = vi.mocked(ajax)

const ntfyConfig = {
    NTFY_URL: 'https://ntfy.sh',
    NTFY_TOPIC: 'test-topic',
}

describe('Ntfy', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockedAjax.mockResolvedValue({ data: { id: 'msg-id-123' }, status: 200, statusText: 'OK', headers: {}, config: {} } as any)
    })

    it('should validate config', () => {
        expect(() => new Ntfy({ NTFY_URL: '', NTFY_TOPIC: '' })).toThrow('"NTFY_URL" 字段是必须的！')
    })

    it('should send basic message with encoded title header', async () => {
        const ntfy = new Ntfy(ntfyConfig)
        const result = await ntfy.send('测试标题', '测试内容')
        expect(result.data).toEqual({ id: 'msg-id-123' })
        const [config] = mockedAjax.mock.calls[0]
        expect(config.url).toBe('https://ntfy.sh/test-topic')
        expect(config.method).toBe('POST')
        expect(config.headers?.['X-Title']).toBe('=?utf-8?B?5rWL6K+V5qCH6aKY?=')
        expect(config.data).toBe('测试内容')
    })

    it('should set auth and option headers', async () => {
        const ntfy = new Ntfy({
            ...ntfyConfig,
            NTFY_AUTH: 'Basic dGVzdDpwYXNz',
        })
        await ntfy.send('标题', '内容', {
            priority: 5,
            tags: 'tag1,tag2',
            markdown: true,
            delay: '30s',
            click: 'https://example.com',
            attach: 'https://example.com/file.pdf',
            icon: 'https://example.com/icon.png',
            actions: '[{"action":"view","label":"查看","url":"https://example.com"}]',
            cache: false,
            firebase: true,
            unifiedPush: true,
            email: 'user@example.com',
            call: '+8613800138000',
        } as any)
        const [config] = mockedAjax.mock.calls[0]
        expect(config.headers).toMatchObject({
            Authorization: 'Basic dGVzdDpwYXNz',
            'X-Priority': '5',
            'X-Tags': 'tag1,tag2',
            'X-Markdown': 'true',
            'X-Delay': '30s',
            'X-Click': 'https://example.com',
            'X-Attach': 'https://example.com/file.pdf',
            'X-Icon': 'https://example.com/icon.png',
            'X-Actions': '[{"action":"view","label":"查看","url":"https://example.com"}]',
            'X-Firebase': 'yes',
            'X-UnifiedPush': '1',
            'X-Email': 'user@example.com',
            'X-Call': '+8613800138000',
        })
        expect(config.headers?.['X-Cache']).toBeUndefined()
    })

    it('should set custom contentType header', async () => {
        const ntfy = new Ntfy(ntfyConfig)
        await ntfy.send('标题', '内容', {
            contentType: 'application/json',
        } as any)
        const [config] = mockedAjax.mock.calls[0]
        expect(config.headers?.['Content-Type']).toBe('application/json')
    })

    it('should set file attachment headers', async () => {
        const ntfy = new Ntfy(ntfyConfig)
        await ntfy.send('标题', '', {
            file: {
                name: 'test.txt',
                size: 1024,
            },
        } as any)
        const [config] = mockedAjax.mock.calls[0]
        expect(config.headers).toMatchObject({
            'X-Filename': 'test.txt',
            'Content-Type': 'application/octet-stream',
            'Content-Length': 1024,
            'Content-Disposition': 'attachment; filename="test.txt"',
        })
    })

    it('should prefer desp over body and message', async () => {
        const ntfy = new Ntfy(ntfyConfig)
        await ntfy.send('标题', 'desp内容', {
            body: 'body内容',
            message: 'message内容',
        } as any)
        const [config] = mockedAjax.mock.calls[0]
        expect(config.data).toBe('desp内容')
        expect(config.headers?.['X-Message']).toBe('=?utf-8?B?bWVzc2FnZeWGheWuuQ==?=')
    })
})
