import { Command } from '../CommandManager'

export class LogOut implements Command {
  public readonly id = 'vscode-vercel.logOut'

  constructor() {}

  execute() {
    console.log('logout')
  }
}
