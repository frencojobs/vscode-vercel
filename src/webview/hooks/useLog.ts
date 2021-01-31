import useSWR from 'swr'

interface DeploymentLog {
  type: string
  created: number
  payload: {
    deploymentId: string
    info: {
      name: string
      type: string
      readyState: string
      entrypoint: string
    }
    id: string
    date: number
    serial: string
    text: string
  }
}

const fetcher = (id: string, accessToken: string) =>
  fetch(`https://api.vercel.com/v2/now/deployments/${id}/events`, {
    headers: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      Authorization: `Bearer ${accessToken}`,
    },
  }).then((res) => res.json())

export const useLog = (id: string, accessToken: string) => {
  const { data, error } = useSWR(id + '/log', () => fetcher(id, accessToken))

  return {
    log: data as Array<DeploymentLog>,
    isLoading: !error && !data,
    isError: error,
  }
}
