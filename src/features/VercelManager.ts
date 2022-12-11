/* eslint-disable @typescript-eslint/naming-convention */
// 👆 because vercel API requires snake_case keys

import axios from 'axios'
import urlcat from 'urlcat'

import { Deployment, Project, Team } from './models'
import { TokenManager } from './TokenManager'

class Api {
  private static baseUrl = 'https://api.vercel.com'
  private static base(path?: string, query?: Record<string, string>) {
    return urlcat(this.baseUrl, path ?? '', query ?? {})
  }
  public static deployments = Api.base('/v5/now/deployments')
  public static teams = Api.base('/v1/teams')
  public static porjects = Api.base('/v4/projects')
}

export class VercelManager {
  public onDidLogOut: () => void = () => {}
  public onDidDeploymentsUpdated: () => void = () => {}

  public onDidTeamsUpdated: () => void = () => {}
  public onDidTeamSelected: () => void = () => {}

  public onDidProjectsUpdated: () => void = () => {}
  public onDidProjectSelected: () => void = () => {}

  public constructor(private readonly token: TokenManager) {
    setInterval(() => {
      this.onDidDeploymentsUpdated()
    }, 30 * 1000)
  }

  public async logIn(apiToken: string): Promise<boolean> {
    try {
      await this.token.setAuth(apiToken)
      this.onDidDeploymentsUpdated()
      this.onDidTeamsUpdated()
      this.onDidProjectsUpdated()
      return true
    } catch (e) {
      console.log(e)
      return false
    }
  }

  async logOut() {
    await this.token.setAuth(undefined)
    await this.token.setTeam(undefined)
    await this.token.setProject(undefined)

    this.onDidLogOut()
    this.onDidDeploymentsUpdated()
    this.onDidTeamsUpdated()
    this.onDidProjectsUpdated()
  }

  async getDeployments() {
    if (this.token.getAuth()) {
      const response = await axios.get<{ deployments: Array<Deployment> }>(
        urlcat(Api.deployments, {
          teamId: this.selectedTeam,
          projectId: this.selectedProject,
        }),
        {
          headers: {
            Authorization: `Bearer ${this.token.getAuth()}`,
          },
        }
      )
      return response.data
    } else {
      return { deployments: [] }
    }
  }

  async getTeams() {
    if (this.token.getAuth()) {
      const response = await axios.get<{ teams: Array<Team> }>(Api.teams, {
        headers: {
          Authorization: `Bearer ${this.token.getAuth()}`,
        },
      })
      return response.data
    } else {
      return { teams: [] }
    }
  }

  get selectedTeam() {
    return this.token.getTeam()
  }

  async switchTeam(id: string) {
    if (this.selectedTeam === id) {
      await this.token.setTeam(undefined)
    } else {
      await this.token.setTeam(id)
    }
    this.onDidTeamSelected()
    this.onDidDeploymentsUpdated()
  }

  async getProjects() {
    if (this.token.getAuth()) {
      const response = await axios.get<{ projects: Array<Project> }>(
        Api.porjects,
        {
          headers: {
            Authorization: `Bearer ${this.token.getAuth()}`,
          },
        }
      )
      return response.data
    } else {
      return { projects: [] }
    }
  }

  get selectedProject() {
    return this.token.getProject()
  }

  async switchProject(id: string) {
    if (this.selectedProject === id) {
      await this.token.setProject(undefined)
    } else {
      await this.token.setProject(id)
    }
    this.onDidProjectSelected()
    this.onDidDeploymentsUpdated()
  }
}
