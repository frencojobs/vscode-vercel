import { Command } from '../CommandManager'
import { VercelManager } from '../features/VercelManager'

export class SwitchTeam implements Command {
  public readonly id = 'vscode-vercel.switchTeam'
  constructor(private readonly vercel: VercelManager) {}
  execute() {}
}
