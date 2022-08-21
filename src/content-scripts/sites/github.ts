import { C2R_USERAGENT } from "../../constants";
import { HighlightFragment, SiteDefinition } from "../../types";
import { htmlToText, sendToReadwise } from "../../utils"

export const definition: SiteDefinition = {
    'github.com': {
        name: 'Github',
        activate
    }
}

function activate(): void {
    document.querySelectorAll(".js-timeline-item")
        .forEach(entry => {
            const commentDropdown = entry.querySelector(".details-overlay .dropdown-menu-sw")
            console.log(entry)
            if (commentDropdown === null) return
            commentDropdown.insertAdjacentElement("afterbegin", createGithubButton(entry.getAttribute('data-gid')!))
        })
}

function createGithubButton(id: string): Element {
    console.log(id)
    const el = document.createElement("button")
    el.type = "button"
    el.classList.add("dropdown-item")
    el.classList.add("btn-link")
    el.setAttribute("role", "menuitem")
    el.innerText = "Save to Readwise"
    el.addEventListener("click", async () => {
        el.innerText = "Saving..."
        try {
            const comment = document.querySelector(`.js-timeline-item[data-gid="${id}"]`)
            const commentBody = comment!.querySelector('.js-comment-body')!.innerHTML
            const title = document.querySelector('.js-issue-title')!.textContent!
            const commentUrl = comment!.querySelector('.timeline-comment-header a.Link--secondary')!.href
            const repoAuthor = document.querySelector('span.author a.url')!.textContent
            const author = comment?.querySelector('a.author')?.textContent
            const payload: HighlightFragment = {
                text: htmlToText(commentBody),
                title,
                author: `${repoAuthor} on Github`,
                note: `Comment by ${author}`,
                highlight_url: commentUrl
            }
            const succesfullyUploaded = await sendToReadwise(payload)
            if (succesfullyUploaded) {
                el.innerText = "Saved to Readwise"
            } else {
                el.innerText = "Failed to save to Readwise"
            }
        } catch (e) {
            console.error(e)
            el.innerText = "Failed to save to Readwise"
        }
    })
    return el
}

// <button type="button" class="dropdown-item btn-link js-comment-quote-reply" data-hotkey="r" role="menuitem">Save to Readwise</button>