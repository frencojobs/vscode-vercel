import * as timeago from 'timeago.js'
import * as vscode from 'vscode'
import enShort from 'timeago.js/lib/lang/en_short'

import { Commit } from './Commit'
import { Deployment } from './models'
import { VercelManager } from './VercelManager'
import { getCommit } from '../utils/createCommit'

timeago.register('en_SHORT', enShort)

export class DeploymentsProvider
  implements vscode.TreeDataProvider<vscode.TreeItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<undefined> = new vscode.EventEmitter()

  readonly onDidChangeTreeData: vscode.Event<undefined> = this
    ._onDidChangeTreeData.event

  private refresh() {
    this._onDidChangeTreeData.fire(undefined)
  }

  constructor(private readonly vercel: VercelManager) {
    this.vercel.onDidDeploymentsUpdated = () => this.refresh()
  }

  getTreeItem(element: DeploymentItem): vscode.TreeItem {
    return element
  }

  async getChildren(element?: DeploymentItem): Promise<Array<vscode.TreeItem>> {
    if (element) {
      const items = [
        new DeploymentOpenUrlItem(element.data.url),
        new DeploymentViewLogItem(
          element.data.uid,
          element.data.name,
          element.data.url,
          element.data.state
        ),
      ]

      if (Object.keys(element.data.meta).length !== 0) {
        const commit = getCommit(element.data.meta)

        if (commit !== null) {
          items.push(
            ...[
              new DeploymentBranchItem(commit),
              new DeploymentCommitItem(commit),
            ]
          )
        }
      }

      return items
    } else {
      const res = await this.vercel.getDeployments()
      return res.deployments.map((x) => new DeploymentItem(x))
    }
  }
}

class DeploymentItem extends vscode.TreeItem {
  constructor(public readonly data: Deployment) {
    super(data.name, vscode.TreeItemCollapsibleState.Collapsed)

    switch (data.state) {
      case 'READY':
        this.iconPath = new vscode.ThemeIcon(
          'symbol-event',
          new vscode.ThemeColor('charts.green')
        )
        break
      case 'ERROR':
        this.iconPath = new vscode.ThemeIcon(
          'circle-filled',
          new vscode.ThemeColor('charts.red')
        )
        break
      case 'CANCELED':
        this.iconPath = new vscode.ThemeIcon(
          'circle-filled',
          new vscode.ThemeColor('charts.gray')
        )
        break
      case 'BUILDING':
        this.iconPath = new vscode.ThemeIcon(
          'circle-filled',
          new vscode.ThemeColor('charts.yellow')
        )
        break
      case 'QUEUED':
        this.iconPath = new vscode.ThemeIcon('circle-outline')
        break
    }

    this.description = timeago.format(data.created, 'en_SHORT')
  }
}

class DeploymentOpenUrlItem extends vscode.TreeItem {
  iconPath = new vscode.ThemeIcon('link')
  contextValue = 'deployment'
  url: string

  constructor(url: string) {
    super('Open URL')
    this.tooltip = url
    this.url = 'https://' + url
    this.command = {
      command: 'vscode.open',
      title: 'Open Deployed Site',
      arguments: [vscode.Uri.parse(this.url)],
    }
  }
}

class DeploymentViewLogItem extends vscode.TreeItem {
  iconPath = new vscode.ThemeIcon('pulse')
  contextValue = 'deploymentLog'
  url: string

  constructor(id: string, name: string, url: string, state: string) {
    super('View Logs')
    this.description = state.toLowerCase()
    this.url = 'https://' + url + '/_logs'
    this.command = {
      command: 'vscode-vercel.openLogPanel',
      title: 'View Vercel Logs',
      arguments: [id, name, state],
    }
  }
}

class DeploymentBranchItem extends vscode.TreeItem {
  iconPath = new vscode.ThemeIcon('git-branch')
  contextValue = 'deployment'
  url: string

  constructor(commit: Commit) {
    super(commit.branch)
    this.description = `${commit.org}/${commit.repo}`
    this.url = commit.branchUrl
    this.command = {
      command: 'vscode0.open',
      title: 'Open Git Branch',
      arguments: [vscode.Uri.parse(commit.branchUrl)],
    }
  }
}

class DeploymentCommitItem extends vscode.TreeItem {
  iconPath = new vscode.ThemeIcon('git-commit')
  contextValue = 'deployment'
  url: string

  constructor(commit: Commit) {
    super(commit.message)
    this.description = commit.author
    this.url = commit.url
    this.command = {
      command: 'vscode.open',
      title: 'Open Git Commit',
      arguments: [vscode.Uri.parse(commit.url)],
    }
  }
}
