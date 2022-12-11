import * as vscode from 'vscode'

import { Command } from '../CommandManager'
import { VercelManager } from '../features/VercelManager'

export class LogIn implements Command {
  public readonly id = 'vscode-vercel.logIn'
  constructor(private readonly vercel: VercelManager) {}
  execute() {
    const config = vscode.workspace.getConfiguration('vscode-vercel')
    const apiToken = config.get('AccessToken') as string
    if (apiToken) {
      this.vercel.logIn(apiToken).then(
        (success) =>
          success &&
          vscode.commands.executeCommand(
            'workbench.view.extension.vscode-vercel-sidebar'
          )
        // vscode.commands.executeCommand('vscode-vercel-deployments.focus')
      )
    } else {
      vscode.window.showErrorMessage(
        'Please provide vscode-vercel.AccessToken in settings.json.'
      )
    }
  }
}
