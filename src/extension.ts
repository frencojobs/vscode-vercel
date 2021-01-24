import * as dotenv from 'dotenv'
import * as vscode from 'vscode'

import * as commands from './commands'
import { CommandManager } from './CommandManager'
import { TokenManager } from './features/TokenManager'
import { VercelManager } from './features/VercelManager'
import DeploymentsProvider from './features/DeploymentsProvider'

dotenv.config()

export async function activate(context: vscode.ExtensionContext) {
  const token = new TokenManager(context.globalState, (state) => {
    vscode.commands.executeCommand('setContext', 'vercelLoggedIn', state)
  })
  const vercel = new VercelManager(token)
  const deployments = new DeploymentsProvider(vercel)

  context.subscriptions.push(registerCommands(vercel))

  vscode.window.createTreeView('vscode-vercel-deployments', {
    treeDataProvider: deployments,
    showCollapseAll: true,
  })
}

function registerCommands(vercel: VercelManager): vscode.Disposable {
  const commandManager = new CommandManager()
  commandManager.register(new commands.LogIn(vercel))
  commandManager.register(new commands.LogOut(vercel))

  commandManager.register(new commands.RefreshDeployments(vercel))
  return commandManager
}
