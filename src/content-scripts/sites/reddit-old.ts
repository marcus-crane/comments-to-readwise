import { C2R_USERAGENT } from "../../constants";
import { HighlightFragment, SiteDefinition } from "../../types";
import { htmlToText, sendToReadwise } from "../../utils";

export const definition: SiteDefinition = {
  'old.reddit.com': {
    name: 'old.reddit.com',
    activate
  }
}

function activate(): void {
  document.querySelectorAll(".comment")
    .forEach(entry => {
      const entryButtons = entry.querySelector("ul.buttons")
      if (entryButtons === null) return
      let permalink = entryButtons.querySelector('a.bylink')
      if (permalink === null) return
      const commentHref = (permalink as HTMLAnchorElement).href
      entryButtons.insertAdjacentElement("beforeend", createReadwiseButton(commentHref))
    })
}

function createReadwiseButton(permalink: string): Element {
  const li = document.createElement('li')
  const el = document.createElement('a')
  el.setAttribute("aria-hidden", "true")
  el.style.cursor = "pointer"
  el.innerText = "save to readwise"
  el.addEventListener("click", async () => {
    el.innerText = "saving..."
    try {
      const commentPayload = await queryRedditApi(permalink)
      if (commentPayload === undefined) return
      const parentComment = commentPayload[0].data.children[0].data
      if (parentComment === undefined) return
      const highlightedComment = commentPayload[1].data.children[0].data
      if (highlightedComment === undefined) return
      const payload: HighlightFragment = {
        text: htmlToText(highlightedComment.body_html),
        title: parentComment.title,
        author: `${parentComment.author} on /r/${parentComment.subreddit}`,
        note: `Comment by ${highlightedComment.author}`,
        highlight_url: permalink
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
  li.appendChild(el)
  return li
}

async function queryRedditApi(permalink: string) {
  // We don't both removing the trailing slash as it resolves fine
  const url: string = `${permalink}.json?context=0&depth=0`
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": C2R_USERAGENT
      }
    })
    if (!res.ok) return
    const data = await res.json()
    return data
  } catch (e: unknown) {
    console.error(`Failed to retrieve old.reddit.com metadata: ${e}`)
  }
}