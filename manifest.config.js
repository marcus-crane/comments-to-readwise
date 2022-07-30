import { defineManifest } from '@crxjs/vite-plugin'
import packageJson from './package.json'
const { version, description } = packageJson

export default defineManifest(async (config, env) => {
  return {
    manifest_version: 3,
    name:
      config.mode === 'development'
        ? '[DEV] Comments to Readwise'
        : 'Comments to Readwise',
    description,
    version,
    homepage_url: "https://github.com/marcus-crane/comments-to-readwise",
    options_page: "src/options/index.html",
    action: {
      default_icon: {
        16: "src/assets/icon16.png",
        48: "src/assets/icon48.png",
        128: "src/assets/icon128.png"
      },
      default_title: "Comments to Readwise"
    },
    icons: {
      16: "src/assets/icon16.png",
      48: "src/assets/icon48.png",
      128: "src/assets/icon128.png"
    },
    permissions: [
      "storage"
    ],
    content_scripts: [
      {
        matches: [
          "*://news.ycombinator.com/item?id=*",
          "*://old.reddit.com/r/*/comments/*"
        ],
        js: [
          "src/content-scripts/main.ts"
        ]
      }
    ],
    host_permissions: [
      "*://news.ycombinator.com/item?id=*",
      "*://old.reddit.com/r/*/comments/*"
    ]
  }
})
