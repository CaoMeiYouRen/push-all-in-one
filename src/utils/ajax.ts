import axios, { AxiosResponse, Method } from 'axios'
import qs from 'qs'
import debug from 'debug'

const Debugger = debug('push:ajax')

class AjaxConfig {
    url: string
    query?: Record<string, unknown>
    data?: Record<string, unknown> | string | Buffer | ArrayBuffer
    method?: Method = 'GET'
    headers?: Record<string, unknown>
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
        const { url, query = {}, data = {}, method = 'GET', headers = {} } = config
        const response = await axios(url, {
            method,
            headers,
            params: query,
            data,
            timeout: 10000,
            transformRequest(reqData: any, reqHeaders?: Record<string, unknown>) {
                const contentType = Object.keys(reqHeaders).find((e) => e.toLocaleLowerCase().includes('Content-Type'.toLocaleLowerCase()))
                if (reqHeaders[contentType] === 'application/x-www-form-urlencoded' && typeof reqData === 'object') {
                    return qs.stringify(reqData)
                }
                if (typeof reqData === 'string') {
                    return reqData
                }
                if (reqData instanceof Buffer || reqData instanceof ArrayBuffer) {
                    return reqData
                }
                if (!reqHeaders['Content-Type']) {
                    reqHeaders['Content-Type'] = 'application/json'
                }
                return JSON.stringify(reqData)
            },
        })
        Debugger('response data: %O', response.data)
        return response
    } catch (error) {
        if (error.toJSON) {
            console.error(error?.response || error.toJSON())
            return error.response
        }
        console.error(error)
        throw error
    }
}
