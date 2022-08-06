import { C2R_CATEGORY, C2R_SOURCE_TYPE, C2R_USERAGENT, READWISE_HIGHLIGHTS_ENDPOINT } from "./constants";
import { HighlightFragment, ReadwisePayload } from "./types";

import showdown from 'showdown'

const converter = new showdown.Converter()

export function htmlToText(htmlString: string) {
  const tempDiv = document.createElement("div")
  tempDiv.innerHTML = htmlString
  return converter.makeMarkdown(tempDiv.innerHTML);
}

export async function sendToReadwise(highlight: HighlightFragment): Promise<boolean> {
  const { token } = await chrome.storage.sync.get('token')
  const payload: ReadwisePayload = {
    ...highlight,
    source_url: window.location.href,
    source_type: C2R_SOURCE_TYPE,
    category: C2R_CATEGORY
  }
  const res = await fetch(READWISE_HIGHLIGHTS_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Token ${token}`,
      "User-Agent": C2R_USERAGENT
    },
    body: JSON.stringify({ highlights: [payload] })
  })
  if (res.ok) return true
  const data = await res.json()
  if (
    Object.keys(data[0]).includes("text") &&
    data[0].text.length &&
    data[0].text[0] === "Ensure this field has no more than 8191 characters."
  ) {
    console.error(`Failed to save comment as it is too long: ${payload.source_url}`)
  } else {
    console.error(`Failed to save comment for unknown reasons: ${JSON.stringify(data)}`)
  }
  return false
}