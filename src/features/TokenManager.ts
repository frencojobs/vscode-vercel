import * as vscode from 'vscode'

export class TokenManager {
  private readonly authKey = 'vscode_vercel_token'
  private readonly teamKey = 'vscode_vercel_selected_team'
  private readonly projectKey = 'vscode_vercel_selected_project'

  private readonly onAuthStateChanged: (state: boolean) => void

  constructor(
    private readonly globalState: vscode.Memento,
    {
      onAuthStateChanged,
    }: {
      onAuthStateChanged: (state: boolean) => void
    }
  ) {
    this.onAuthStateChanged = onAuthStateChanged

    // initial run
    this.onAuthStateChanged(!!globalState.get(this.authKey))
  }

  setAuth(token: string | undefined) {
    this.onAuthStateChanged(!!token)
    return this.globalState.update(this.authKey, token)
  }

  getAuth(): string | undefined {
    return this.globalState.get(this.authKey)
  }

  setTeam(token: string | undefined) {
    return this.globalState.update(this.teamKey, token)
  }

  getTeam(): string | undefined {
    return this.globalState.get(this.teamKey)
  }

  setProject(token: string | undefined) {
    return this.globalState.update(this.projectKey, token)
  }

  getProject(): string | undefined {
    return this.globalState.get(this.projectKey)
  }
}
