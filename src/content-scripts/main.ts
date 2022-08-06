import { siteDefinitions } from "./sites"

(async function () {
  const currentSite = window.location.host
  console.log(currentSite)
  if (Object.keys(siteDefinitions).includes(currentSite)) {
    siteDefinitions[currentSite].activate()
  }
})()