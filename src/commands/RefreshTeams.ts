import { Command } from '../CommandManager'
import { VercelManager } from '../features/VercelManager'

export class RefreshTeams implements Command {
  public readonly id = 'vscode-vercel.refreshTeams'
  constructor(private readonly vercel: VercelManager) {}
  execute() {
    this.vercel.onDidTeamsUpdated()
  }
}
