import { ActionCard } from './ActionCard'
import { FeedCard } from './FeedCard'
import { Link } from './Link'
import { Markdown } from './Markdown'
import { MessageTemplateAbs } from './template'
import { Text } from './Text'

export type Message = MessageTemplateAbs | ActionCard | FeedCard | Link | Markdown | Text
