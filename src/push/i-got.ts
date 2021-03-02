import { ajax } from '@/utils/ajax'
import { warn } from '@/utils/helper'
import { AxiosResponse } from 'axios'
import debug from 'debug'
import { Send } from '../interfaces/send'

const Debugger = debug('push:i-got')

export class IGot implements Send {

    constructor() { }

    send(...args: any[]): Promise<any> {
        throw new Error('Method not implemented.')
    }

}
