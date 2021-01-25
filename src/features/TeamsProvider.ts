import * as vscode from 'vscode'

import { Team } from './models'
import { VercelManager } from './VercelManager'

export class TeamsProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<undefined> = new vscode.EventEmitter()

  readonly onDidChangeTreeData: vscode.Event<undefined> = this
    ._onDidChangeTreeData.event

  private data: Array<Team> = []
  private async updateData() {
    const res = await this.vercel.getTeams()
    this.data = res.teams
  }

  private refresh() {
    this._onDidChangeTreeData.fire(undefined)
  }

  constructor(private readonly vercel: VercelManager) {
    this.vercel.onDidTeamsUpdated = () =>
      this.updateData().then(() => this.refresh())
    this.vercel.onDidTeamsSelected = () => this.refresh()
  }

  getTreeItem(element: TeamItem): vscode.TreeItem {
    return element
  }

  async getChildren(): Promise<Array<vscode.TreeItem>> {
    if (this.data.length === 0) {
      await this.updateData()
    }

    return this.data.map(
      (x) =>
        new TeamItem(
          x,
          !!this.vercel.selectedTeam && this.vercel.selectedTeam === x.id
        )
    )
  }
}

class TeamItem extends vscode.TreeItem {
  constructor(data: Team, selected: boolean) {
    super(data.name)
    this.description = data.slug
    this.command = {
      command: 'vscode-vercel.switchTeam',
      title: 'Switch Vercel Team',
      arguments: [data.id],
    }
    if (selected) {
      this.iconPath = new vscode.ThemeIcon('check')
    }
  }
}
