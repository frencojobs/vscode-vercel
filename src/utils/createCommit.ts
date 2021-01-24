import { Commit } from '../features/Commit'
import { Deployment, Meta } from '../features/models'
import { getProvider } from './getProvider'

export function getCommit(x: Deployment) {
  const provider = getProvider(x.meta as Record<string, string>)

  switch (provider) {
    case 'bitbucket': {
      const meta = x.meta as Meta<'bitbucket'>
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
      const meta = x.meta as Meta<'github'>
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
      const meta = x.meta as Meta<'gitlab'>
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
}
