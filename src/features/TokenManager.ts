import * as vscode from 'vscode'

const KEY = 'vscode_vercel_token'
export class TokenManager {
  constructor(
    private readonly globalState: vscode.Memento,
    private readonly onAuthStateChanged: (state: boolean) => void
  ) {
    onAuthStateChanged(!!globalState.get(KEY))
  }

  setToken(token: string | undefined) {
    this.onAuthStateChanged(!!token)
    return this.globalState.update(KEY, token)
  }

  getToken(): string | undefined {
    return this.globalState.get(KEY)
  }
}
