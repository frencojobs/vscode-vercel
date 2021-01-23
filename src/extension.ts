import * as dotenv from 'dotenv'
import * as vscode from 'vscode'

import * as commands from './commands'
import { CommandManager } from './CommandManager'
import { VercelManager } from './features/VercelManager'
import DeploymentsProvider from './features/DeploymentsProvider'

export async function activate(context: vscode.ExtensionContext) {
  dotenv.config()

  const vercel = new VercelManager()
  const deployments = new DeploymentsProvider()

  context.subscriptions.push(registerCommands(vercel))
  context.subscriptions.push(
    vscode.window.registerTreeDataProvider(
      'vscode-vercel-deployments',
      deployments
    )
  )
}

function registerCommands(vercel: VercelManager): vscode.Disposable {
  const commandManager = new CommandManager()
  commandManager.register(new commands.LogIn(vercel))
  commandManager.register(new commands.LogOut())
  return commandManager
}
