import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('./utils/ajax', () => ({
    ajax: vi.fn(),
}))

import { runPushAllInOne, runPushAllInCloud } from './one'
import { ajax } from './utils/ajax'

const mockedAjax = vi.mocked(ajax)

describe('runPushAllInOne', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockedAjax.mockResolvedValue({ data: { code: 0 }, status: 200, statusText: 'OK', headers: {}, config: {} } as any)
    })

    it('should dispatch to the matched push channel', async () => {
        const result = await runPushAllInOne('测试标题', '测试内容', {
            type: 'Dingtalk',
            config: {
                DINGTALK_ACCESS_TOKEN: 'token123',
            },
            option: {
                msgtype: 'text',
            },
        })
        expect(result.data).toEqual({ code: 0 })
        expect(mockedAjax).toHaveBeenCalledTimes(1)
        const [config] = mockedAjax.mock.calls[0]
        expect(config.url).toBe('https://oapi.dingtalk.com/robot/send')
        expect(config.method).toBe('POST')
        expect(config.query).toMatchObject({
            access_token: 'token123',
        })
        expect(config.data).toMatchObject({
            msgtype: 'text',
            text: {
                content: '测试标题\n测试内容',
            },
        })
    })

    it('should throw error when type is not matched', async () => {
        await expect(runPushAllInOne('标题', '内容', {
            type: 'NotExist' as any,
            config: {},
            option: {},
        })).rejects.toThrow('未匹配到任何推送方式！')
    })
})

describe('runPushAllInCloud', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should forward push request to cloud service', async () => {
        mockedAjax.mockResolvedValue({ data: { code: 0 }, status: 200, statusText: 'OK', headers: {}, config: {} } as any)
        const result = await runPushAllInCloud('测试标题', '测试内容', {
            type: 'WxPusher',
            config: {
                WX_PUSHER_APP_TOKEN: 'token123',
                WX_PUSHER_UID: 'uid123',
            },
            option: {},
            baseUrl: 'https://cloud.example.com',
            authToken: 'auth-token-123',
        })
        expect(result).toEqual({ code: 0 })
        expect(mockedAjax).toHaveBeenCalledTimes(1)
        const [config] = mockedAjax.mock.calls[0]
        expect(config.url).toBe('https://cloud.example.com/forward')
        expect(config.method).toBe('POST')
        expect(config.headers).toEqual({
            'Content-Type': 'application/json',
            Authorization: 'Bearer auth-token-123',
        })
        expect(config.data).toMatchObject({
            title: '测试标题',
            desp: '测试内容',
            type: 'WxPusher',
        })
    })

    it('should throw error when status >= 400', async () => {
        mockedAjax.mockResolvedValue({ data: {}, status: 500, statusText: 'Internal Server Error', headers: {}, config: {} } as any)
        await expect(runPushAllInCloud('标题', '内容', {
            type: 'WxPusher',
            config: {
                WX_PUSHER_APP_TOKEN: 'token123',
                WX_PUSHER_UID: 'uid123',
            },
            option: {},
            baseUrl: 'https://cloud.example.com',
            authToken: 'auth-token-123',
        })).rejects.toThrow('推送请求失败，状态码：500')
    })
})
