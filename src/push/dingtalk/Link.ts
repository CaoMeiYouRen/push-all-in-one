/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { MessageTemplateAbs } from './template'

class Link extends MessageTemplateAbs {
    title: string
    messageUrl: string
    picUrl?: string
    text: string
    constructor(content: any) {
        super()
        this.msgtype = 'link'
        this.title = ''
        this.messageUrl = ''
        this.picUrl = ''

        this.setContent(content)
    }

    setContent(content: string) {
        this.text = content
        return this
    }

    setTitle(title: string) {
        this.title = title
        return this
    }

    setImage(image: string) {
        this.picUrl = image
        return this
    }

    setUrl(url: string) {
        this.messageUrl = url
        return this
    }

    get() {
        return this.render({
            link: {
                text: this.text,
                title: this.title,
                picUrl: this.picUrl,
                messageUrl: this.messageUrl,
            },
        })
    }
}

export { Link }
