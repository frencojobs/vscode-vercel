import useSWR from 'swr'

const fetcher = (id: string, accessToken: string) =>
  fetch(`https://api.vercel.com/v12/now/deployments/${id}`, {
    headers: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      Authorization: `Bearer ${accessToken}`,
    },
  }).then((res) => res.json())

export const useStatus = (id: string, accessToken: string) => {
  const { data, error } = useSWR(id, () => fetcher(id, accessToken))

  return {
    status: data,
    isLoading: !error && !data,
    isError: error,
  }
}
