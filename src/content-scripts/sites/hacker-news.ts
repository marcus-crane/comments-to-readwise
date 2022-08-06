import { C2R_USERAGENT } from "../../constants";
import { HighlightFragment, SiteDefinition } from "../../types";
import { htmlToText, sendToReadwise } from "../../utils"

const HN_AGOLIA_COMMENT_ENDPOINT = "https://hn.algolia.com/api/v1/items"

export const definition: SiteDefinition = {
  'news.ycombinator.com': {
    name: 'Hacker News',
    activate
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
  el.addEventListener("click", async () => {
    el.innerText = 'saving...'
    try {
      const comment = await queryHackerNewsApi(Number(id))
      if (comment === undefined) return
      const parentComment = await queryHackerNewsApi(comment.story_id)
      if (parentComment === undefined) return
      const payload: HighlightFragment = {
        text: htmlToText(comment.text),
        title: parentComment.title!,
        author: `${parentComment.author} on Hacker News`,
        note: `Comment by ${comment.author}`,
        highlight_url: `https://news.ycombinator.com/item?id=${comment.id}`
      }
      const succesfullyUploaded = await sendToReadwise(payload)
      if (succesfullyUploaded) {
        el.innerText = "saved!"
      } else {
        el.innerText = "failed to save"
      }
    } catch (e) {
      console.error(e)
      el.innerText = "failed to save"
    }
  })
  return el
}

async function queryHackerNewsApi(id: Number): Promise<HackerNewsMetadata | undefined> {
  const url: string = `${HN_AGOLIA_COMMENT_ENDPOINT}/${id}`
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": C2R_USERAGENT
      }
    })
    if (!res.ok) return
    const data: HackerNewsMetadata = await res.json()
    return data
  } catch (e: unknown) {
    console.error(`Failed to retrieve Hacker News metadata: ${e}`)
  }
}