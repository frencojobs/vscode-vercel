import * as timeago from 'timeago.js'
import * as vscode from 'vscode'

import { Project } from './models'
import { VercelManager } from './VercelManager'

export class ProjectsProvider
  implements vscode.TreeDataProvider<vscode.TreeItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<undefined> = new vscode.EventEmitter()

  readonly onDidChangeTreeData: vscode.Event<undefined> = this
    ._onDidChangeTreeData.event

  private data: Array<Project> = []
  private async updateData() {
    const res = await this.vercel.getProjects()
    this.data = res.projects
  }

  private refresh() {
    this._onDidChangeTreeData.fire(undefined)
  }

  constructor(private readonly vercel: VercelManager) {
    this.vercel.onDidProjectsUpdated = () =>
      this.updateData().then(() => this.refresh())
    this.vercel.onDidProjectSelected = () => this.refresh()
  }

  getTreeItem(element: ProjectItem): vscode.TreeItem {
    return element
  }

  async getChildren(): Promise<Array<vscode.TreeItem>> {
    if (this.data.length === 0) {
      await this.updateData()
    }

    return this.data.map(
      (x) =>
        new ProjectItem(
          x,
          !!this.vercel.selectedProject && this.vercel.selectedProject === x.id
        )
    )
  }
}

class ProjectItem extends vscode.TreeItem {
  constructor(data: Project, selected: boolean) {
    super(data.name)
    this.description = timeago.format(data.updatedAt, 'en_SHORT')
    this.command = {
      command: 'vscode-vercel.switchProject',
      title: 'Switch Vercel Project',
      arguments: [data.id],
    }
    if (selected) {
      this.iconPath = new vscode.ThemeIcon('check')
    }
  }
}
