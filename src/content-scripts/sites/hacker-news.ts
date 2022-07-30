import { SiteDefinition } from "."

import {
  C2R_USERAGENT,
  htmlToText
} from "../utils"

const HN_AGOLIA_COMMENT_ENDPOINT = "https://hn.algolia.com/api/v1/items"

export const definition: SiteDefinition = {
  'news.ycombinator.com': {
    name: 'Hacker News',
    activate,
    retrieveParentContext
  }
}

interface HackerNewsMetadata {
  id: Number;
  created_at: string;
  created_at_i: Number;
  type: string,
  author: string;
  title: string | null;
  url: string | null;
  text: string,
  points: Number | null;
  parent_id: Number;
  story_id: Number;
}


function activate(): void {
  document.querySelectorAll("tr.comtr")
    .forEach(entry => {
      const entryNavs = entry.querySelector("span.navs")
      if (entryNavs === null) return
      entryNavs.insertAdjacentText("beforebegin", " | ")
      entryNavs.insertAdjacentElement("beforebegin", createReadwiseButton(entry.id))
    })
}

function createReadwiseButton(id: string): Element {
  const el = document.createElement('a')
  el.style.cursor = "pointer"
  el.classList.add(`upload-${id}`)
  el.setAttribute("aria-hidden", "true")
  el.innerText = "save to readwise"
  el.addEventListener("click", () => {
    queryHackerNewsApi(id)
      .then(data => {
        console.log(data)
        console.log(htmlToText(data!.text))
      })
      .catch(e => console.log(e))
  })
  return el
}

async function queryHackerNewsApi(id: string): Promise<HackerNewsMetadata | undefined> {
  const headers = new Headers()
  headers.append("User-Agent", C2R_USERAGENT)
  const url: string = `${HN_AGOLIA_COMMENT_ENDPOINT}/${id}`
  try {
    const res = await fetch(url, { headers })
    if (!res.ok) return
    const data: HackerNewsMetadata = await res.json()
    return data
  } catch (e: unknown) {
    console.error(`Failed to retrieve Hacker News metadata: ${e}`)
  }
}

async function retrieveParentContext(id: string) {

}
