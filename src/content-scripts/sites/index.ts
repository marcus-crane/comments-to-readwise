import { SiteDefinition } from '../../types'

import { definition as github } from './github'
import { definition as hackerNews } from './hacker-news'

export const siteDefinitions: SiteDefinition = {
  ...github,
  ...hackerNews,
}