import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/utils/ajax', () => ({
    ajax: vi.fn(),
}))

import { Feishu } from './feishu'
import { ajax } from '@/utils/ajax'

const mockedAjax = vi.mocked(ajax)

const feishuConfig = {
    FEISHU_APP_ID: 'cli_appid123',
    FEISHU_APP_SECRET: 'appsecret123',
}

describe('Feishu', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockedAjax.mockImplementation(async (config: any) => {
            if (config.url.includes('/auth/v3/tenant_access_token/internal')) {
                return { data: { code: 0, tenant_access_token: 'tenant-token-abc', expire: 7200 }, status: 200, statusText: 'OK', headers: {}, config: {} } as any
            }
            return { data: { code: 0, msg: 'ok' }, status: 200, statusText: 'OK', headers: {}, config: {} } as any
        })
    })

    it('should validate config', () => {
        expect(() => new Feishu({ FEISHU_APP_ID: '', FEISHU_APP_SECRET: '' })).toThrow('"FEISHU_APP_ID" 字段是必须的！')
    })

    it('should fetch access token on first send', async () => {
        const feishu = new Feishu(feishuConfig)
        const result = await feishu.send('测试标题', '测试内容')
        expect(result.data).toEqual({ code: 0, msg: 'ok' })
        expect(mockedAjax).toHaveBeenCalledTimes(2)
        const [authConfig] = mockedAjax.mock.calls[0]
        expect(authConfig.url).toBe('https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal')
        expect(authConfig.data).toEqual({
            app_id: 'cli_appid123',
            app_secret: 'appsecret123',
        })
        const [sendConfig] = mockedAjax.mock.calls[1]
        expect(sendConfig.url).toBe('https://open.feishu.cn/open-apis/im/v1/messages')
        expect(sendConfig.headers?.['Authorization']).toBe('Bearer tenant-token-abc')
        expect(sendConfig.query).toEqual({
            receive_id_type: 'open_id',
        })
        expect(sendConfig.data).toEqual({
            receive_id: undefined,
            msg_type: 'text',
            content: JSON.stringify({
                text: '测试标题\n测试内容',
            }),
            uuid: undefined,
        })
    })

    it('should reuse cached access token on second send', async () => {
        const feishu = new Feishu(feishuConfig)
        await feishu.send('测试标题', '测试内容')
        await feishu.send('测试标题2', '测试内容2')
        expect(mockedAjax).toHaveBeenCalledTimes(3)
        const [firstConfig] = mockedAjax.mock.calls[0]
        expect(firstConfig.url).toContain('tenant_access_token')
        const [secondConfig] = mockedAjax.mock.calls[1]
        const [thirdConfig] = mockedAjax.mock.calls[2]
        expect(secondConfig.url).toContain('im/v1/messages')
        expect(thirdConfig.url).toContain('im/v1/messages')
    })

    it('should throw error when get token fails', async () => {
        mockedAjax.mockImplementation(async (config: any) => {
            if (config.url.includes('/auth/v3/tenant_access_token/internal')) {
                return { data: { code: 10003, msg: 'invalid app_secret' }, status: 200, statusText: 'OK', headers: {}, config: {} } as any
            }
            return { data: {}, status: 200, statusText: 'OK', headers: {}, config: {} } as any
        })
        const feishu = new Feishu(feishuConfig)
        await expect(feishu.send('测试标题', '测试内容')).rejects.toThrow('invalid app_secret')
    })

    it('should send post message', async () => {
        const feishu = new Feishu(feishuConfig)
        await feishu.send('测试标题', '测试内容', {
            receive_id_type: 'open_id',
            receive_id: 'ou_user123',
            msg_type: 'post',
        })
        const [sendConfig] = mockedAjax.mock.calls[1]
        expect(sendConfig.data).toMatchObject({
            receive_id: 'ou_user123',
            msg_type: 'post',
            content: JSON.stringify({
                post: {
                    zh_cn: {
                        title: '测试标题',
                        content: [[{ tag: 'text', text: '测试内容' }]],
                    },
                },
            }),
        })
    })

    it('should use provided content directly', async () => {
        const feishu = new Feishu(feishuConfig)
        await feishu.send('测试标题', '测试内容', {
            receive_id_type: 'open_id',
            receive_id: 'ou_user123',
            msg_type: 'text',
            content: '{"text":"自定义内容"}',
        })
        const [sendConfig] = mockedAjax.mock.calls[1]
        expect((sendConfig.data as any).content).toBe('{"text":"自定义内容"}')
    })
})
