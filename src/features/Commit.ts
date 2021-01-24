/**
 * Referenced from
 * github.com/daneden/zeitgeist/blob/main/Shared/Models/GitCommit.swift
 */

import urlcat from 'urlcat'

export class Commit {
  private urlPatterns = {
    bitbucket: 'https://bitbucket.com/:org/:repo',
    github: 'https://github.com/:org/:repo',
    gitlab: 'https://gitlab.com/:org/:repo',
  } as const

  private branchPatterns = {
    bitbucket: '/branch/:branch',
    github: '/tree/:branch',
    gitlab: '/-/tree/:branch',
  } as const

  private commitPatterns = {
    bitbucket: '/commits/:sha',
    github: '/commit/:sha',
    gitlab: '/-/commit/:sha',
  } as const

  constructor(
    readonly provider: 'bitbucket' | 'github' | 'gitlab',
    readonly sha: string,
    readonly message: string,
    readonly author: string,
    readonly repo: string,
    readonly org: string,
    readonly branch: string
  ) {}

  get summary() {
    return this.message.split('\n')[0] ?? '(Empty Commit Message)'
  }

  get url() {
    return urlcat(
      this.urlPatterns[this.provider] + this.commitPatterns[this.provider],
      {
        org: this.org,
        repo: this.repo,
        sha: this.sha,
      }
    )
  }

  get branchUrl() {
    return urlcat(
      this.urlPatterns[this.provider] + this.branchPatterns[this.provider],
      {
        org: this.org,
        repo: this.repo,
        branch: this.branch,
      }
    )
  }

  get shortSha() {
    return this.sha.substr(0, 7)
  }
}
