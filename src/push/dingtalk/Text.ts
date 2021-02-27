/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { MessageTemplateAbs } from './template'

class Text extends MessageTemplateAbs {
    content: string
    constructor(content: string) {
        super()
        this.msgtype = 'text'
        this.canAt = true
        this.setContent(content)
    }

    setContent(content: string) {
        this.content = content
        return this
    }

    get() {
        return this.render({
            text: {
                content: this.content,
            },
        })
    }
}

export { Text }
