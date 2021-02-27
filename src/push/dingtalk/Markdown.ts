/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { MessageTemplateAbs } from './template'

class Markdown extends MessageTemplateAbs {
    items: string[]
    title: string
    constructor() {
        super()
        this.msgtype = 'markdown'
        this.canAt = true
        this.items = []
    }

    setTitle(title: string) {
        this.title = title
        return this
    }

    add(text: string | string[]) {
        if (Array.isArray(text)) {
            this.items.concat(text)
        } else {
            this.items.push(text)
        }

        return this
    }

    get() {
        return this.render({
            markdown: {
                title: this.title,
                text: this.items.join('\n'),
            },
        })
    }
}

export { Markdown }
