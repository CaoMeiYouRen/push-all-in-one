import axios, { AxiosResponse, Method, AxiosRequestHeaders } from 'axios'
import qs from 'qs'
import debug from 'debug'
import { HttpsProxyAgent } from 'https-proxy-agent'
import { SocksProxyAgent } from 'socks-proxy-agent'

const Debugger = debug('push:ajax')

interface AjaxConfig {
    url: string
    query?: Record<string, unknown>
    data?: Record<string, unknown> | string | Buffer | ArrayBuffer
    method?: Method
    headers?: Record<string, unknown>
    baseURL?: string
}

/**
 * axios 接口封装
 *
 * @author CaoMeiYouRen
 * @date 2021-02-27
 * @export
 * @param config
 * @returns
 */
export async function ajax<T = any>(config: AjaxConfig): Promise<AxiosResponse<T>> {
    try {
        Debugger('ajax config: %O', config)
        const { url, query = {}, method = 'GET', baseURL = '' } = config
        const headers = (config.headers || {}) as AxiosRequestHeaders
        let { data = {} } = config

        if (headers['Content-Type'] === 'application/x-www-form-urlencoded' && typeof data === 'object') {
            data = qs.stringify(data)
        }

        let httpAgent = null
        let httpsAgent = null
        Debugger('NO_PROXY: %s', process.env.NO_PROXY)
        if (!process.env.NO_PROXY) {
            Debugger('HTTP_PROXY: %s', process.env.HTTP_PROXY)
            Debugger('HTTPS_PROXY: %s', process.env.HTTPS_PROXY)
            Debugger('SOCKS_PROXY: %s', process.env.SOCKS_PROXY)
            if (url?.startsWith('http://') || baseURL?.startsWith('http://')) {
                if (process.env.HTTP_PROXY) {
                    httpAgent = new HttpsProxyAgent(process.env.HTTP_PROXY)
                } else if (process.env.SOCKS_PROXY) {
                    httpAgent = new SocksProxyAgent(process.env.SOCKS_PROXY)
                }
            } else if (url?.startsWith('https://') || baseURL?.startsWith('https://')) {
                if (process.env.HTTPS_PROXY) {
                    httpsAgent = new HttpsProxyAgent(process.env.HTTPS_PROXY)
                } else if (process.env.SOCKS_PROXY) {
                    httpsAgent = new SocksProxyAgent(process.env.SOCKS_PROXY)
                }
            }
        }
        const response = await axios(url, {
            baseURL,
            method,
            headers,
            params: query,
            data,
            timeout: 10000,
            httpAgent,
            httpsAgent,
            proxy: false,
        })
        Debugger('response data: %O', response.data)
        return response
    } catch (error) {
        if (error?.response) {
            console.error(error.response)
            return error.response
        }
        if (error.toJSON) {
            console.error(error.toJSON())
        } else {
            console.error(error)
        }
        throw error
    }
}
