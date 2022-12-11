# VSCode Vercel V2

Keep an eye on ▲ Vercel deployments without ever leaving Visual Studio Code.

<img align="center" src="https://raw.githubusercontent.com/frencojobs/vscode-vercel/main/.github/demo.png" />

## Setup

Simply set vercel-vscode.AccessToken to the value gotten by going to [https://vercel.com/account/tokens](https://vercel.com/account/tokens) and clicking create.

## Features

Here is a list of features the extension currently supports.

- 📜 View deployment & their details (with dedicated side bar)
- ✅ View (real-time) logs with a webview
- 🔎 Filter the deployment statuses based on teams & projects

This is an updated version of [frencojobs' vscode-vercel](https://github.com/frencojobs/vscode-vercel)

## Important!

I can not and am not promising repairation of any features that were broken in the original. I only updated the authentication script to get the token from settings.json instead of the now depreciated Oauth V2 provided by Vercel.

I have not, and don't plan to, attempted to repair the display of the logs, I am simply bringing life back to an old, yet, useful extension. If you would like to fix problems, such as the above, please feel free to fork this repo and submit a pull request.
