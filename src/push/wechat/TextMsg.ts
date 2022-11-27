class Text {
    content: string
    mentioned_list?: string[]
    mentioned_mobile_list?: string[]
}

export class TextMsg {
    constructor(obj: TextMsg) {
        Object.assign(this, obj)
    }
    msgtype: 'text' = 'text' as const
    text: Text
}

