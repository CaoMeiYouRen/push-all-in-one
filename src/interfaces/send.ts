/**
 * 要求所有 push 方法都至少实现了 send 接口
 *
 * @author CaoMeiYouRen
 * @date 2021-02-27
 * @export
 * @interface Send
 */
interface Send {
    send(...args: any[]): Promise<any>
}
export { Send }
