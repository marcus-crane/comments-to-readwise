import { SiteDefinition } from '../../types'

import { definition as github } from './github'
import { definition as hackerNews } from './hacker-news'
import { definition as redditOld } from './reddit-old'

export const siteDefinitions: SiteDefinition = {
  ...github,
  ...hackerNews,
  ...redditOld
}