/* Markdown*/
export class Markdown {
    content: string
}

/* tsModel1*/
export class MarkdownMsg {
    constructor(obj: MarkdownMsg) {
        Object.assign(this, obj)
    }
    msgtype: 'markdown' = 'markdown'
    markdown: Markdown
}

