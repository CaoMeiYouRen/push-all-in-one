/* Markdown*/
export class Markdown {
    content: string
}

export class MarkdownMsg {
    constructor(obj: MarkdownMsg) {
        Object.assign(this, obj)
    }
    msgtype: 'markdown' = 'markdown' as const
    markdown: Markdown
}

