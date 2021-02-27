import { Send } from '../interfaces/send'
import { createTransport, SendMailOptions } from 'nodemailer'
import debug from 'debug'

const Debugger = debug('push:email')

type Mail = ReturnType<typeof createTransport>
type Args = Parameters<typeof createTransport>

export class Email implements Send {

    private mail: Mail

    constructor(...args: Args) {
        this.mail = createTransport(...args)
    }

    close(): void {
        this.mail.close()
    }

    async send(mailOptions: SendMailOptions): Promise<any> {
        return new Promise((resolve: (value: unknown) => void, reject: (err: Error) => void) => {
            this.mail.sendMail(mailOptions, (err, info) => {
                if (err) {
                    return reject(err)
                }
                return resolve(info)
            })
        })
    }
}