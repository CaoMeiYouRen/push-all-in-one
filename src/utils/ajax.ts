import axios, { AxiosResponse, Method, AxiosRequestHeaders } from 'axios'
import qs from 'qs'
import debug from 'debug'

const Debugger = debug('push:ajax')

interface AjaxConfig {
    url: string
    query?: Record<string, unknown>
    data?: Record<string, unknown> | string | Buffer | ArrayBuffer
    method?: Method
    headers?: AxiosRequestHeaders
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
export async function ajax(config: AjaxConfig): Promise<AxiosResponse<any>> {
    try {
        Debugger('ajax config: %O', config)
        const { url, query = {}, method = 'GET', headers = {} } = config
        let { data = {} } = config

        if (headers['Content-Type'] === 'application/x-www-form-urlencoded' && typeof data === 'object') {
            data = qs.stringify(data)
        }

        const response = await axios(url, {
            method,
            headers,
            params: query,
            data,
            timeout: 10000,
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
