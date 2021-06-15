import { Commit } from '../features/Commit'
import { Meta } from '../features/models'
import { getProvider } from './getProvider'

export function getCommit(input: Record<string, string>) {
  try {
    const provider = getProvider(input)

    switch (provider) {
      case 'bitbucket': {
        const meta = input as Meta<'bitbucket'>
        return new Commit(
          provider,
          meta.bitbucketCommitSha,
          meta.bitbucketCommitMessage,
          meta.bitbucketCommitAuthorName,
          meta.bitbucketRepo,
          meta.bitbucketOrg,
          meta.bitbucketCommitRef
        )
      }
      case 'github': {
        const meta = input as Meta<'github'>
        return new Commit(
          provider,
          meta.githubCommitSha,
          meta.githubCommitMessage,
          meta.githubCommitAuthorName,
          meta.githubRepo,
          meta.githubOrg,
          meta.githubCommitRef
        )
      }
      case 'gitlab': {
        const meta = input as Meta<'gitlab'>
        return new Commit(
          provider,
          meta.gitlabCommitSha,
          meta.gitlabCommitMessage,
          meta.gitlabCommitAuthorName,
          meta.gitlabRepo,
          meta.gitlabOrg,
          meta.gitlabCommitRef
        )
      }
    }
  } catch (e) {
    return null
  }
}
