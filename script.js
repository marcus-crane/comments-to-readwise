(async function () {
  READWISE_TOKEN = ""

  function getTokenFromStorage() {
    return new Promise(resolve => {
      chrome.storage.sync.get('token', resolve);
    })
  }

  const storage = await getTokenFromStorage()
  READWISE_TOKEN = storage.token

  if (READWISE_TOKEN === "") {
    console.error("Your Readwise token is not set. Please configure it in the options page of the Comments to Readwise extension.")
    return
  }

  COMMENT_TREE = {}
  SUBMISSION_TITLE = ""
  SUBMISSION_AUTHOR = ""

  switch(window.location.host) {
    case "old.reddit.com":
      SUBMISSION_TITLE = document.querySelector(".top-matter a.title").innerText
      SUBMISSION_AUTHOR = document.querySelector(".top-matter a.author").innerText
      SUBREDDIT_NAME = `/r/${document.querySelector(".redditname").innerText}`
      preloadCommentPayloadsReddit()
      console.log("Activated Reddit uploading")
      break
    case "news.ycombinator.com":

      SUBMISSION_TITLE = document.querySelector("td.title a").innerText
      SUBMISSION_AUTHOR = document.querySelector(".subtext .hnuser").innerText
      preloadCommentPayloads()
      console.log("Activated Hacker News uploading")
      break
    default:
      console.log("Window location not in allowlist")
      return
      break
  }

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
          "source_type": "CommentsToReadwise",
          "category": "tweets",
          "note": `Comment by ${username}`,
          "highlight_url": `https://news.ycombinator.com/item?id=${item.id}`
        }
        addButtonToComment(item)
      })
  }

  function preloadCommentPayloadsReddit() {
    document.querySelectorAll(".comment")
      .forEach(item => {
        comment = item.querySelector(".entry form .usertext-body .md")
        if (comment === null) {
          console.log(`No comment body for ${item.id} so skipping...`)
          return
        }
        comment_text = comment.innerText
        author = item.querySelector(".entry .tagline")
        if (author.querySelector(".author") === null) {
          // If there is no author element, we just assume they are a deleted account
          username = "[deleted]"
        } else {
          username = author.querySelector(".author").innerText
        }
        comment_link = item.querySelector(".bylink").href
        COMMENT_TREE[item.id] = {
          "text": comment_text,
          "title": SUBMISSION_TITLE,
          "author": `${SUBMISSION_AUTHOR} on ${SUBREDDIT_NAME}`,
          "source_url": window.location.href,
          "source_type": "CommentsToReadwise",
          "category": "tweets",
          "note": `Comment by ${username}`,
          "highlight_url": comment_link,
        }
        addButtonToCommentReddit(item)
      })
  }

  function addButtonToCommentReddit(item) {
    item.querySelector("ul.buttons").insertAdjacentHTML(
      "beforeend",
      `<li><a href="javascript:void(0)" class="upload-${item.id}" aria-hidden="true">send to readwise</a></li>`
    )
    item.querySelector(`.upload-${item.id}`).addEventListener("click", () => sendToReadwise(item.id))
  }

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
    return new Promise(resolve => {
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
          resolve()
        }
        if (!res.ok) {
          return res.json()
        }
      })
      .then(data => {
        if (data[0].id) return // succesfully uploaded, no need to check for errors
        if (data[0].text[0] === "Ensure this field has no more than 8191 characters.") {
          changeButtonText(comment_id, "comment is too long to save!")
        } else {
          changeButtonText(comment_id, "failed to save to readwise")
        }
      })
      .catch(err => {
        console.log(err)
      })
    })
  }
})()
