import * as vscode from 'vscode'

import { LogPanelManager } from './LogPanelManager'

export class LogPanel {
  public static readonly viewType = 'vscode-vercel.logView'
  public static readonly viewActiveContextKey = 'vercelLogViewFocus'

  private disposables: Array<vscode.Disposable> = []

  constructor(
    public readonly id: string,
    private readonly panel: vscode.WebviewPanel,
    private readonly manager: LogPanelManager
  ) {
    this.update()
    this.panel.onDidDispose(() => this.dispose(), null, this.disposables)
    this.panel.onDidChangeViewState(
      (_) => {
        if (this.panel.visible) {
          this.update()
        }
      },
      null,
      this.disposables
    )
  }

  public get isActive() {
    return this.panel.active
  }

  public revive(column: vscode.ViewColumn | undefined) {
    this.panel.reveal(column)
  }

  public refresh() {
    this.update()
  }

  private dispose() {
    this.setViewActiveContext(false)
    this.panel.dispose()
    this.manager.dispose(this.id)

    while (this.disposables.length) {
      const x = this.disposables.pop()
      if (x) {
        x.dispose()
      }
    }
  }

  private update() {
    this.setViewActiveContext(this.panel.active)
    this.panel.webview.html = this.manager.getHTML(this.panel.webview, {
      id: this.id,
    })
  }

  private setViewActiveContext(value: boolean) {
    vscode.commands.executeCommand(
      'setContext',
      LogPanel.viewActiveContextKey,
      value
    )
  }
}
