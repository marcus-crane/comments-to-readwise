export const htmlToText = (htmlString: string) => {
  const tempDiv = document.createElement("div")
  tempDiv.innerHTML = htmlString
  return tempDiv.innerText || "";
}

export const C2R_USERAGENT = "CommentsToReadwise <https://github.com/marcus-crane/comments-to-readwise>"
