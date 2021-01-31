export function getProvider(input: Record<string, string>) {
  const firstKey = Object.keys(input)[0]
  if (firstKey.includes('bitbucket')) {
    return 'bitbucket' as const
  } else if (firstKey.includes('github')) {
    return 'github' as const
  } else if (firstKey.includes('gitlab')) {
    return 'gitlab' as const
  }

  throw Error('unspported git platform')
}
