/* eslint-disable @typescript-eslint/naming-convention */
// 👆 because vercel API requires snake case keys

import * as polka from 'polka'
import * as vscode from 'vscode'
import { nanoid } from 'nanoid'
import axios from 'axios'
import urlcat from 'urlcat'

import { TokenManager } from './TokenManager'

export class VercelManager {
  private baseUrl = 'https://api.vercel.com/v2'

  private api(path?: string, query?: Record<string, string>) {
    return urlcat(this.baseUrl, path ?? '', query ?? {})
  }

  public logIn() {
    const uuid = nanoid()
    const app = polka()

    app.get('/oauth/callback', async (req, res) => {
      const { code, state } = req.query as { code: string; state: string }

      if (!code || !state) {
        res.end('something went wrong')
        return
      }

      if (state !== uuid) {
        res.end('invalid authentication')
        return
      }

      try {
        console.log(this.api('/oauth/access_token'))
        console.log({
          client_id: process.env.CLIENT_ID,
          client_secret: process.env.CLIENT_SECRET,
          code,
          redirect_uri: `http://localhost:${process.env.CALLBACK_PORT}/oauth`,
        })

        const response = await axios.post<{ access_token: string }>(
          this.api('/oauth/access_token'),
          {
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            code,
            redirect_uri: `https://localhost:${process.env.CALLBACK_PORT}/oauth`,
          },
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          }
        )

        console.log('just got response', response)
        if (response.data.access_token) {
          await TokenManager.setToken(response.data.access_token)
          res.end('successfully authenticated! you can close this now')
        }
      } catch (e) {
        console.log(e)
        res.end('error exchanging access token')
      } finally {
        console.log('before closing server')
        app.server?.close()
      }
    })

    app.get(`/oauth`, async (_, res) => {
      res.end(`successfully redirected! you can close this now`)
    })

    app.listen(process.env.CALLBACK_PORT, (err: Error) => {
      if (err) {
        vscode.window.showErrorMessage(err.message)
      } else {
        vscode.commands.executeCommand(
          'vscode.open',
          vscode.Uri.parse(
            this.api('/oauth/authorize', {
              client_id: process.env.CLIENT_ID,
              state: uuid,
            })
          )
        )
      }
    })
  }
}
