/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { MessageTemplateAbs } from './template'

class ActionCard extends MessageTemplateAbs {
    title: string
    text: string
    hideAvatar: number
    btnOrientation?: number
    singleTitle: string
    singleURL: string
    btns: { title: string, actionURL: string }[]
    constructor() {
        super()
        this.msgtype = 'actionCard'

        this.title = ''
        this.text = ''
        // 0-正常发消息者头像，1-隐藏发消息者头像
        this.hideAvatar = 0
        // 0-按钮竖直排列，1-按钮横向排列
        this.btnOrientation = 0

        // 单个按钮的方案。(设置此项和singleURL后btns无效)
        this.singleTitle = ''
        this.singleURL = ''
        this.btns = []
    }

    setBtns(btns: ConcatArray<{ title: string, actionURL: string }>) {
        this.btns = this.btns.concat(btns)
        return this
    }

    setSingleTitle(title: string) {
        this.singleTitle = title
        return this
    }

    setSingleURL(url: string) {
        this.singleURL = url
        return this
    }

    setTitle(title: string) {
        this.title = title
        return this
    }

    setText(content: string) {
        this.text = content
        return this
    }

    setBtnOrientation(flag: number) {
        this.btnOrientation = flag
        return this
    }

    setHideAvatar(flag: number) {
        this.hideAvatar = flag
        return this
    }

    get() {
        return this.render({
            actionCard: {
                title: this.title,
                text: this.text,
                hideAvatar: this.hideAvatar,
                btnOrientation: this.btnOrientation,
                btns: this.btns,
                singleTitle: this.singleTitle,
                singleURL: this.singleURL,
            },
        })
    }
}

export { ActionCard }
