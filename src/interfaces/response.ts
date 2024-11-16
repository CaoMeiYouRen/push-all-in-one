export interface SendResponse<T = any> {
    headers?: any
    status: number
    statusText: string
    data: T
}
