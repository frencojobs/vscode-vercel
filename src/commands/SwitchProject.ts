import * as vscode from 'vscode'

import { Command } from '../CommandManager'
import { VercelManager } from '../features/VercelManager'

export class SwitchProject implements Command {
  public readonly id = 'vscode-vercel.switchProject'
  constructor(private readonly vercel: VercelManager) {}
  execute(id: string) {
    if (id) {
      this.vercel.switchProject(id)
    } else {
      vscode.window
        .showQuickPick(
          this.vercel
            .getProjects()
            .then((x) => x.projects.map((x) => `${x.name} (${x.id})`))
        )
        .then((selected) => {
          const id = selected?.match(/\((.*)+\)/)?.[1]
          if (id) {
            this.vercel.switchProject(id)
          }
        })
    }
  }
}
