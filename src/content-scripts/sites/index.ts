import { definition as hackerNews } from './hacker-news'

export type SiteDefinition = Record<string, SiteMethods>

export type SiteMethods = {
  name: string;
  activate: Function,
  retrieveParentContext: Function
}

export const siteDefinitions: SiteDefinition = {
  ...hackerNews,
}

