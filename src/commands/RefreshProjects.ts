import { Command } from '../CommandManager'
import { VercelManager } from '../features/VercelManager'

export class RefreshProjects implements Command {
  public readonly id = 'vscode-vercel.refreshProjects'
  constructor(private readonly vercel: VercelManager) {}
  execute() {
    this.vercel.onDidProjectsUpdated()
  }
}
