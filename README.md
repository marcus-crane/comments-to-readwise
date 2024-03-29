# Comments to Readwise

> [Install from the Chrome Web Store](https://chrome.google.com/webstore/detail/mbpckcijlikkkakedodgpgkdmgbdogmp)

> [Install from the Firefox Addon Store](https://addons.mozilla.org/en-US/firefox/addon/comments-to-readwise/)

![](./docs/example.png)

A basic Manifest v3 extension for sending Hacker News and Reddit (old.reddit.com only) comments to Readwise as "tweets"

Ideally I'll support a bunch more sources in future.

Readwise will hopefully just a "comments" category down the line instead of abusing "tweets" but it works for now.

## Setup

Once installed, you need to navigate to the extension settings and configure your Readwise token.

This gets persisted to your Chrome storage so your token should sync across browser instances.

![](./docs/settings.png)

Once your token is saved, you should see the "Save to Readwise" button appear over Hacker News comments

## Development

This plugin uses Vite to build the plugin from Typescript files.

There are only a couple of steps to build a development bundle:

```bash
$ pnpm install # yarn or npm if you prefer, i use pnpm
$ pnpm run dev
```

Once done, you should have a `dist` folder that you can load into Chrome / Chromium browsers as an "Unpacked extension"

## Current issues

At present, the extension only runs on the initial comment page for a submission.

It won't work if you go to the direct link for a comment, such that the original story and author isn't visible on the page.

## Reminder for myself re: Firefox

The existing hacky XPI is created by bundling the extension, replacing with attributes from `manifest-firefox.json` (see `NOTE_FOR_FIREFOX_REVIEWERS.md`) and then signed with [web-ext sign](https://github.com/mozilla/web-ext)
