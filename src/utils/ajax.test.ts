import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import axios from 'axios'

vi.mock('axios', () => ({
    __esModule: true,
    default: vi.fn(),
}))

import { HttpsProxyAgent } from 'https-proxy-agent'
import { SocksProxyAgent } from 'socks-proxy-agent'
import { ajax } from './ajax'

const mockedAxios = vi.mocked(axios)

describe('ajax', () => {
    const originalEnv = { ...process.env }

    beforeEach(() => {
        vi.clearAllMocks()
        process.env = { ...originalEnv }
        delete process.env.HTTP_PROXY
        delete process.env.HTTPS_PROXY
        delete process.env.SOCKS_PROXY
        delete process.env.NO_PROXY
        mockedAxios.mockResolvedValue({ data: {}, status: 200, statusText: 'OK', headers: {}, config: {} } as any)
    })

    afterEach(() => {
        process.env = originalEnv
    })

    it('should send GET request with query params', async () => {
        await ajax({
            url: 'https://example.com/api',
            query: { a: 1, b: 'test' },
            method: 'GET',
        })
        expect(mockedAxios).toHaveBeenCalledTimes(1)
        const [url, config] = mockedAxios.mock.calls[0]
        expect(url).toBe('https://example.com/api')
        expect(config.method).toBe('GET')
        expect(config.params).toEqual({ a: 1, b: 'test' })
        expect(config.timeout).toBe(60000)
        expect(config.proxy).toBe(false)
    })

    it('should convert form-urlencoded data', async () => {
        await ajax({
            url: 'https://example.com/api',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            data: {
                text: 'hello world',
                num: '1',
            },
        })
        const [url, config] = mockedAxios.mock.calls[0]
        expect(config.data).toBe('text=hello+world&num=1')
    })

    it('should keep json data as object', async () => {
        const data = { text: 'hello' }
        await ajax({
            url: 'https://example.com/api',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            data,
        })
        const [url, config] = mockedAxios.mock.calls[0]
        expect(config.data).toEqual(data)
    })

    it('should use HTTPS_PROXY as HttpsProxyAgent', async () => {
        process.env.HTTPS_PROXY = 'http://127.0.0.1:7890'
        await ajax({
            url: 'https://example.com/api',
        })
        const [url, config] = mockedAxios.mock.calls[0]
        expect(config.httpAgent).toBeInstanceOf(HttpsProxyAgent)
    })

    it('should use SOCKS_PROXY as SocksProxyAgent', async () => {
        process.env.SOCKS_PROXY = 'socks://127.0.0.1:7890'
        await ajax({
            url: 'https://example.com/api',
        })
        const [url, config] = mockedAxios.mock.calls[0]
        expect(config.httpAgent).toBeInstanceOf(SocksProxyAgent)
    })

    it('should prioritize proxyUrl over environment variables', async () => {
        process.env.HTTPS_PROXY = 'http://127.0.0.1:7890'
        await ajax({
            url: 'https://example.com/api',
            proxyUrl: 'socks://127.0.0.1:7891',
        })
        const [url, config] = mockedAxios.mock.calls[0]
        expect(config.httpAgent).toBeInstanceOf(SocksProxyAgent)
    })

    it('should disable proxy when NO_PROXY is true', async () => {
        process.env.NO_PROXY = 'true'
        process.env.HTTPS_PROXY = 'http://127.0.0.1:7890'
        await ajax({
            url: 'https://example.com/api',
        })
        const [url, config] = mockedAxios.mock.calls[0]
        expect(config.httpAgent).toBeNull()
    })

    it('should return error response when axios rejects with response', async () => {
        const errorResponse = { data: { errcode: 400 }, status: 400, statusText: 'Bad Request', headers: {}, config: {} }
        mockedAxios.mockRejectedValue({ response: errorResponse })
        const result = await ajax({
            url: 'https://example.com/api',
        })
        expect(result).toEqual(errorResponse)
    })

    it('should throw error when axios rejects without response', async () => {
        mockedAxios.mockRejectedValue(new Error('network error'))
        await expect(ajax({
            url: 'https://example.com/api',
        })).rejects.toThrow('network error')
    })
})
