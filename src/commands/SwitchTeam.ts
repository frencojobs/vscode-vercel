import * as vscode from 'vscode'

import { Command } from '../CommandManager'
import { VercelManager } from '../features/VercelManager'

export class SwitchTeam implements Command {
  public readonly id = 'vscode-vercel.switchTeam'
  constructor(private readonly vercel: VercelManager) {}
  execute(id: string) {
    if (id) {
      this.vercel.switchTeam(id)
    } else {
      vscode.window
        .showQuickPick(
          this.vercel
            .getTeams()
            .then((x) => x.teams.map((x) => `${x.name} (${x.id})`))
        )
        .then((selected) => {
          const id = selected?.match(/\((.*)+\)/)?.[1]
          if (id) {
            this.vercel.switchTeam(id)
          }
        })
    }
  }
}
