import * as vscode from 'vscode'

export default class DeploymentsProvider
  implements vscode.TreeDataProvider<DeploymentItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<
    DeploymentItem | undefined
  > = new vscode.EventEmitter<DeploymentItem | undefined>()

  readonly onDidChangeTreeData: vscode.Event<DeploymentItem | undefined> = this
    ._onDidChangeTreeData.event

  private refresh() {
    this._onDidChangeTreeData.fire(undefined)
  }

  constructor() {}

  getTreeItem(element: DeploymentItem): vscode.TreeItem {
    return element
  }

  getChildren(): Thenable<Array<DeploymentItem>> {
    return Promise.resolve([])
  }
}

class DeploymentItem extends vscode.TreeItem {
  iconPath = new vscode.ThemeIcon('symbol-file')

  constructor(public readonly label: string, public readonly id: string) {
    super(label)
  }
}
