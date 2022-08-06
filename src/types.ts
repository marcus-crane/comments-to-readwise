export type SiteDefinition = Record<string, SiteMethods>

export type SiteMethods = {
  name: string;
  activate: Function
}

export type ReadwisePayload = {
  text: string;
  title: string;
  author: string;
  source_url: string;
  source_type: string;
  category: string;
  note: string;
  highlight_url: string;
}

export type HighlightFragment = {
  text: string;
  title: string;
  author: string;
  note: string;
  highlight_url: string;
}