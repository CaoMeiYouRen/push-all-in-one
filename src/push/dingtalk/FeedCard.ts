/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { MessageTemplateAbs } from './template'
import { Link } from './Link'

class FeedCard extends MessageTemplateAbs {
    links: Link[]
    constructor(links: Link[]) {
        super()
        this.msgtype = 'feedCard'

        this.links = links || []
    }

    addLinks(links: Link[]) {
        this.links = this.links.concat(links)
        return this
    }

    get() {
        return this.render({
            feedCard: {
                links: this.links,
            },
        })
    }
}

export { FeedCard }
