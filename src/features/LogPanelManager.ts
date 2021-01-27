import * as vscode from 'vscode'

import { LogPanel } from './LogPanel'
import { TokenManager } from './TokenManager'
import { getNonce } from '../utils/getNonce'

export class LogPanelManager implements vscode.WebviewPanelSerializer {
  private readonly uri: vscode.Uri
  public cache = new Map<string, LogPanel>()

  constructor(
    private readonly context: vscode.ExtensionContext,
    private readonly token: TokenManager
  ) {
    this.uri = this.context.extensionUri
  }

  public async createOrShow(id: string) {
    const column = vscode.window.activeTextEditor
      ? vscode.window.activeTextEditor.viewColumn
      : undefined

    if (this.cache.has(id)) {
      this.cache.get(id)?.revive(column)
    } else {
      const panel = vscode.window.createWebviewPanel(
        LogPanel.viewType,
        'Vercel',
        column || vscode.ViewColumn.One,
        {
          enableScripts: true,
          retainContextWhenHidden: true,
          localResourceRoots: [vscode.Uri.joinPath(this.uri, 'resources')],
        }
      )
      panel.iconPath = this.iconPath
      this.cache.set(id, new LogPanel(id, panel, this))
    }
  }

  public async deserializeWebviewPanel(
    webviewPanel: vscode.WebviewPanel,
    state: { id: string; accessToken: string }
  ) {
    this.cache.set(state.id, new LogPanel(state.id, webviewPanel, this))
  }

  public dispose(id: string) {
    this.cache.delete(id)
  }

  private getMetaTags(webview: vscode.Webview, nonce: string): string {
    return `
    <meta charset="UTF-8">
    <meta name="viewport" 
            content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Security-Policy" 
            content="default-src 'none'; 
                     connect-src 'self' https://api.vercel.com;
                     style-src ${webview.cspSource} 'nonce-${nonce}'; 
                     img-src ${webview.cspSource} https:; 
                     script-src 'nonce-${nonce}';">`
  }

  private getStyles(webview: vscode.Webview, uri: vscode.Uri): string {
    return ['reset.css', 'vscode.css', 'custom.css']
      .map((x) =>
        webview.asWebviewUri(vscode.Uri.joinPath(uri, 'resources', 'styles', x))
      )
      .map((x) => `<link href="${x}" rel="stylesheet" />`)
      .join('')
  }

  private getScripts(
    webview: vscode.Webview,
    uri: vscode.Uri,
    nonce: string,
    state: { id: string }
  ): string {
    const reactWebviewUri = webview.asWebviewUri(
      vscode.Uri.joinPath(uri, 'resources', 'webview', 'index.js')
    )

    return `
    <script nonce=${nonce}>
      const vscode = acquireVsCodeApi();
      vscode.setState(${JSON.stringify({
        id: state.id,
        accessToken: this.token.getAuth(),
      })})
      window.vscode = vscode;
    </script>
    <script nonce="${nonce}" src="${reactWebviewUri}"></script>`
  }

  public get iconPath() {
    const root = vscode.Uri.joinPath(this.uri, 'resources', 'icons')
    return {
      light: vscode.Uri.joinPath(root, 'light', 'vercel.svg'),
      dark: vscode.Uri.joinPath(root, 'dark', 'vercel.svg'),
    }
  }

  public getHTML(webview: vscode.Webview, state: { id: string }) {
    const nonce = getNonce()

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        ${this.getMetaTags(webview, nonce)}
        ${this.getStyles(webview, this.uri)}
    </head>
    <body>
        <div id="root"></div>
        ${this.getScripts(webview, this.uri, nonce, state)}
    </body>
    </html>`
  }
}
