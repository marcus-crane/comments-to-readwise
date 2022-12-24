# Note for Firefox Reviewers

Hi there,

You may find this repo a bit confusing. It was created as a Chrome extension using Manifest V3 but I had a request to create a Firefox version so I've hacked together a Manifest V2 version compatible for the Firefox store.

You can produce the extension like so:

In the base repository:

```console
pnpm install // or npm if you like
pnpm build
```

This builds a Manifest V3 distribution which is what is hosted in the Google Chrome Store

From there, I made hand-edits to `manifest.json` in order to support Manifest V2.

Those changes are the following:

```diff
{
+ "manifest_version": 2,
- "manifest_version": 3,
  "name": "Comments to Readwise",
  "description": "Allows you to save comments to Readwise as it says on the tin",
  "version": "2.1.0",
  "homepage_url": "https://github.com/marcus-crane/comments-to-readwise",
- "options_page": "src/options/index.html",
+ "options_ui": {
+   "page": "src/options/index.html"
+ },
- "action": {
+ "browser_action": {
    "default_icon": {
      "16": "src/assets/icon16.png",
      "48": "src/assets/icon48.png",
      "128": "src/assets/icon128.png"
    },
    "default_title": "Comments to Readwise"
  },
  "icons": {
    "16": "src/assets/icon16.png",
    "48": "src/assets/icon48.png",
    "128": "src/assets/icon128.png"
  },
  "permissions": [
-   "storage"
+   "storage",
+   "https://hn.algolia.com/",
+   "https://readwise.io/"
  ],
  "content_scripts": [
    {
      "js": [
        "assets/content-script-loader.main.ts.c1a3e174.d53becca.js"
      ],
      "matches": [
        "*://github.com/*/*/issues/*",
        "*://github.com/*/*/pull/*",
        "*://news.ycombinator.com/item?id=*",
        "*://old.reddit.com/r/*/comments/*"
      ]
    }
- ],
+ ]
- "host_permissions": [
-   "*://github.com/*/*/issues/*",
-   "*://github.com/*/*/pull/*",
-   "*://news.ycombinator.com/item?id=*",
-   "*://old.reddit.com/r/*/comments/*"
- ],
- "web_accessible_resources": [
-   {
-     "matches": [
-       "*://github.com/*",
-       "*://github.com/*",
-       "*://news.ycombinator.com/*",
-       "*://old.reddit.com/*"
-     ],
-     "resources": [
-       "assets/main.ts.c1a3e174.js"
-     ],
-     "use_dynamic_url": true
-   }
- ]
}
```

I used the following build tools personally although any LTS or above versions should work fine.

- node v18.12.1
- pnpm version 7.17.1 (or you could use npm 9.1.2)
- macOS Ventura 13.0.1