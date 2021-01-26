import * as dotenv from 'dotenv'
import * as vscode from 'vscode'

import * as commands from './commands'
import { CommandManager } from './CommandManager'
import { DeploymentsProvider } from './features/DeploymentsProvider'
import { ProjectsProvider } from './features/ProjectsProvider'
import { TeamsProvider } from './features/TeamsProvider'
import { TokenManager } from './features/TokenManager'
import { VercelManager } from './features/VercelManager'

dotenv.config()

export async function activate(context: vscode.ExtensionContext) {
  const token = new TokenManager(context.globalState, {
    onAuthStateChanged: (state) => {
      vscode.commands.executeCommand('setContext', 'vercelLoggedIn', state)
    },
  })
  const vercel = new VercelManager(token)

  const deployments = new DeploymentsProvider(vercel)
  const teams = new TeamsProvider(vercel)
  const projects = new ProjectsProvider(vercel)

  context.subscriptions.push(registerCommands(vercel))

  vscode.window.createTreeView('vscode-vercel-deployments', {
    treeDataProvider: deployments,
    showCollapseAll: true,
  })

  vscode.window.createTreeView('vscode-vercel-teams', {
    treeDataProvider: teams,
  })

  vscode.window.createTreeView('vscode-vercel-projects', {
    treeDataProvider: projects,
  })
}

function registerCommands(vercel: VercelManager): vscode.Disposable {
  const commandManager = new CommandManager()

  commandManager.register(new commands.LogIn(vercel))
  commandManager.register(new commands.LogOut(vercel))
  commandManager.register(new commands.CopyURL())
  commandManager.register(new commands.RefreshDeployments(vercel))
  commandManager.register(new commands.RefreshTeams(vercel))
  commandManager.register(new commands.SwitchTeam(vercel))
  commandManager.register(new commands.RefreshProjects(vercel))
  commandManager.register(new commands.SwitchProject(vercel))

  return commandManager
}
