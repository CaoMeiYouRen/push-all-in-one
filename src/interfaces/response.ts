export interface SendResponse<T = any> {
    status: number
    statusText: string
    data: T
}
