import axios, { AxiosResponse, Method } from 'axios'
import qs from 'qs'

class AjaxConfig {
    url: string
    query?: Record<string, unknown>
    data?: Record<string, unknown>
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
        const { url, query = {}, data = {}, method = 'GET', headers = {} } = config
        const resp = await axios(url, {
            method,
            headers,
            params: query,
            data,
            timeout: 10000,
            baseURL: '',
            transformRequest(reqData: any, reqHeaders?: Record<string, unknown>) {
                const contentType = Object.keys(reqHeaders).find((e) => {
                    return e.toLocaleLowerCase().includes('content-type')
                })
                if (contentType === 'application/x-www-form-urlencoded' && typeof reqData === 'object') {
                    return qs.stringify(reqData)
                }
                if (typeof reqData === 'string' || reqData instanceof Buffer || reqData instanceof ArrayBuffer) {
                    return reqData
                }
                return JSON.stringify(reqData)
            },
        })
        return resp
    } catch (error) {
        if (error.toJSON) {
            console.error(error.toJSON())
            return error.response
        }
        console.error(error)
        throw error
    }
}