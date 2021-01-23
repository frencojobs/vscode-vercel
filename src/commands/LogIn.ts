import { Command } from '../CommandManager'
import { VercelManager } from '../features/VercelManager'

export class LogIn implements Command {
  public readonly id = 'vscode-vercel.logIn'

  constructor(private readonly vercel: VercelManager) {}

  execute() {
    this.vercel.logIn()
  }
}
