import * as vscode from 'vscode'

import * as commands from './commands'
import { CommandManager } from './CommandManager'
import { DeploymentsProvider } from './features/DeploymentsProvider'
import { LogPanelManager } from './features/LogPanelManager'
import { ProjectsProvider } from './features/ProjectsProvider'
import { TeamsProvider } from './features/TeamsProvider'
import { TokenManager } from './features/TokenManager'
import { VercelManager } from './features/VercelManager'

export async function activate(context: vscode.ExtensionContext) {
  const token = new TokenManager(context.globalState, {
    onAuthStateChanged: (state) => {
      vscode.commands.executeCommand('setContext', 'vercelLoggedIn', state)
    },
  })
  const vercel = new VercelManager(token)
  const logPanelManager = new LogPanelManager(vercel, context, token)

  const deployments = new DeploymentsProvider(vercel)
  const teams = new TeamsProvider(vercel)
  const projects = new ProjectsProvider(vercel)

  context.subscriptions.push(registerCommands(vercel, logPanelManager))
  context.subscriptions.push(
    vscode.window.registerWebviewPanelSerializer(
      'vscode-vercel.logView',
      logPanelManager
    )
  )

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

function registerCommands(
  vercel: VercelManager,
  logPanelManager: LogPanelManager
): vscode.Disposable {
  const commandManager = new CommandManager()

  commandManager.register(new commands.LogIn(vercel))
  commandManager.register(new commands.LogOut(vercel))
  commandManager.register(new commands.OpenLogPanel(logPanelManager))
  commandManager.register(new commands.RefreshLogPanel(logPanelManager))
  commandManager.register(new commands.OpenURL())
  commandManager.register(new commands.CopyURL())
  commandManager.register(new commands.RefreshDeployments(vercel))
  commandManager.register(new commands.RefreshTeams(vercel))
  commandManager.register(new commands.SwitchTeam(vercel))
  commandManager.register(new commands.RefreshProjects(vercel))
  commandManager.register(new commands.SwitchProject(vercel))

  return commandManager
}
