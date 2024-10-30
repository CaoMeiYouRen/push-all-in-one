import axios, { AxiosResponse, Method, AxiosRequestHeaders } from 'axios'
import debug from 'debug'
import HttpsProxyAgent from 'https-proxy-agent'
import SocksProxyAgent from 'socks-proxy-agent'
import { isHttpURL, isSocksUrl } from './helper'

const Debugger = debug('push:ajax')

interface AjaxConfig {
    url: string
    query?: Record<string, unknown>
    data?: Record<string, unknown> | string | Buffer | ArrayBuffer
    method?: Method
    headers?: Record<string, unknown>
    baseURL?: string
    proxyUrl?: string
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
        const { url, query = {}, method = 'GET', baseURL = '', proxyUrl } = config
        const headers = (config.headers || {}) as AxiosRequestHeaders
        let { data = {} } = config

        if (headers['Content-Type'] === 'application/x-www-form-urlencoded' && typeof data === 'object') {
            data = new URLSearchParams(data as Record<string, string>).toString()
        }

        let httpAgent = null
        Debugger('NO_PROXY: %s', process.env.NO_PROXY)
        if (process.env.NO_PROXY !== 'true') {
            Debugger('HTTP_PROXY: %s', process.env.HTTP_PROXY)
            Debugger('HTTPS_PROXY: %s', process.env.HTTPS_PROXY)
            Debugger('SOCKS_PROXY: %s', process.env.SOCKS_PROXY)
            if (isHttpURL(proxyUrl)) {
                httpAgent = HttpsProxyAgent(proxyUrl)
            } else if (isSocksUrl(proxyUrl)) {
                httpAgent = SocksProxyAgent(proxyUrl)
            } else if (process.env.HTTPS_PROXY) {
                httpAgent = HttpsProxyAgent(process.env.HTTPS_PROXY)
            } else if (process.env.HTTP_PROXY) {
                httpAgent = HttpsProxyAgent(process.env.HTTP_PROXY)
            } else if (process.env.SOCKS_PROXY) {
                httpAgent = SocksProxyAgent(process.env.SOCKS_PROXY)
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
            httpsAgent: httpAgent,
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
