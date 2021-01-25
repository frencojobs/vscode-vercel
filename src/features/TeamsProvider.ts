import * as vscode from 'vscode'

import { Team } from './models'
import { VercelManager } from './VercelManager'

export default class TeamsProvider
  implements vscode.TreeDataProvider<vscode.TreeItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<undefined> = new vscode.EventEmitter()

  readonly onDidChangeTreeData: vscode.Event<undefined> = this
    ._onDidChangeTreeData.event

  private refresh() {
    this._onDidChangeTreeData.fire(undefined)
  }

  constructor(private readonly vercel: VercelManager) {
    this.vercel.onDidTeamsUpdated = () => this.refresh()
  }

  getTreeItem(element: TeamItem): vscode.TreeItem {
    return element
  }

  async getChildren(): Promise<Array<vscode.TreeItem>> {
    const res = await this.vercel.getTeams()
    return res.teams.map((x) => new TeamItem(x))
  }
}

class TeamItem extends vscode.TreeItem {
  constructor(public readonly data: Team) {
    super(data.name)
  }
}
