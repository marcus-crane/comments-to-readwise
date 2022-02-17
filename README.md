# Comments to Readwise

> [Install from the Chrome Web Store](https://chrome.google.com/webstore/detail/mbpckcijlikkkakedodgpgkdmgbdogmp)

![](./example.png)

A basic Manifest v3 extension for sending Hacker News and Reddit (old.reddit.com only) comments to Readwise as "tweets"

Ideally I'll support a bunch more sources in future.

Readwise will hopefully just a "comments" category down the line instead of abusing "tweets" but it works for now.

## Setup

Once installed, you need to navigate to the extension settings and configure your Readwise token.

This gets persisted to your Chrome storage so your token should sync across browser instances.

![](./settings.png)

Once your token is saved, you should see the "Save to Readwise" button appear over Hacker News comments

## Current issues

At present, the extension only runs on the initial comment page for a submission.

It won't work if you go to the direct link for a comment, such that the original story and author isn't visible on the page.
