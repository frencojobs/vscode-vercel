import { Command } from '../CommandManager'
import { LogPanelManager } from '../features/LogPanelManager'

export class RefreshLogPanel implements Command {
  public readonly id = 'vscode-vercel.refreshLogPanel'
  constructor(private readonly manager: LogPanelManager) {}
  execute() {
    Array.from(this.manager.cache.values())
      .filter((x) => x.isActive)
      .forEach((x) => x.refresh())
  }
}
