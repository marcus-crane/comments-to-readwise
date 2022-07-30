import { siteDefinitions } from "./sites"

(async function () {
  const currentSite = window.location.host
  if (Object.keys(siteDefinitions).includes(currentSite)) {
    siteDefinitions[currentSite].activate()
  }
})()
