/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
class MessageTemplateAbs {
    canAt: boolean
    isAtAll: boolean
    atMobiles: Set<string>
    atDingtalkIds: Set<string>
    msgtype: string
    constructor() {
        this.canAt = false
        this.isAtAll = false
        this.atMobiles = new Set()
        this.atDingtalkIds = new Set()
        if (new.target === MessageTemplateAbs) {
            throw new Error('抽象类不可以实例化')
        }
    }

    render(options: unknown) {
        return Object.assign({
            msgtype: this.msgtype,
        }, options, this.canAt
            ? {
                at: {
                    atMobiles: Array.from(this.atMobiles),
                    atDingtalkIds: Array.from(this.atDingtalkIds),
                    isAtAll: this.isAtAll,
                },
            }
            : {})
    }

    get(): any {
        throw new Error('抽象方法render不可以调用')
    }

    toJsonString(): string {
        throw new Error('抽象方法toJsonString不可以调用')
    }

    atAll() {
        this.isAtAll = true
        return this
    }

    atPhone(phones: string | string[]) {
        if (phones instanceof Array) {
            phones.forEach((phone) => {
                this.atMobiles.add(phone)
            })
        } else {
            this.atMobiles.add(phones)
        }
        return this
    }

    atId(ids: string | string[]) {
        if (ids instanceof Array) {
            ids.forEach((phone) => {
                this.atDingtalkIds.add(phone)
            })
        } else {
            this.atDingtalkIds.add(ids)
        }
        return this
    }
}

export { MessageTemplateAbs }
