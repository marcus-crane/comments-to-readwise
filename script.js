(function () {
  READWISE_TOKEN = ""

  COMMENT_TREE = {}

  SUBMISSION_TITLE = document.querySelector("td.title a").innerText
  SUBMISSION_AUTHOR = document.querySelector(".subtext .hnuser").innerText

  function preloadCommentPayloads() {
    document.querySelectorAll("tr.comtr")
      .forEach(item => {
        comment_text = item.querySelector(".commtext").innerText.replace("\n\nreply", "")
        username = item.querySelector(".hnuser").innerText
        COMMENT_TREE[item.id] = {
          "text": comment_text,
          "title": SUBMISSION_TITLE,
          "author": `${SUBMISSION_AUTHOR} on Hacker News`,
          "source_url": window.location.href,
          "source_type": "CommentsForReadwise",
          "category": "tweets",
          "note": `Comment by ${username}`,
          "highlight_url": `https://news.ycombinator.com/item?id=${item.id}`
        }
        addButtonToComment(item)
      })
  }

  preloadCommentPayloads()

  function addButtonToComment(item) {
    item.querySelector("span.navs").insertAdjacentHTML(
      "afterBegin",
      ` | <a style="cursor: pointer" class="upload-${item.id}" aria-hidden="true">save to readwise</a>`
    )
    item.querySelector(`.upload-${item.id}`).addEventListener("click", () => sendToReadwise(item.id))
  }

  function changeButtonText(comment_id, text) {
    document.querySelector(`.upload-${comment_id}`).innerText = text
  }

  function sendToReadwise(comment_id) {
    changeButtonText(comment_id, "saving...")
    const data = {
      "highlights": [
        COMMENT_TREE[comment_id]
      ]
    }
    fetch("https://readwise.io/api/v2/highlights/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${READWISE_TOKEN}`
      },
      body: JSON.stringify(data)
    })
    .then(res => {
      if (res.ok) {
        changeButtonText(comment_id, "saved!")
        console.log("Saved comment succesfully")
      }
    })
    .catch(err => {
      console.error(err)
      changeButtonText(comment_id, "save to readwise")
    })
  }
})()
