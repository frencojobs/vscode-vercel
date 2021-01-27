import React, { useEffect, useState } from 'react'

import { getTime } from './utils/getTime'
import { useLog } from './hooks/useLog'
import { useStatus } from './hooks/useStatus'

declare global {
  interface Window {
    vscode: {
      getState: () => { id: string; accessToken: string }
      setState: (state: any) => void
      postMessage: (message: any) => void
    }
  }
}

// eslint-disable-next-line @typescript-eslint/naming-convention
const App: React.FC = () => {
  const [state] = useState(window.vscode.getState())
  const { log, isLoading, isError } = useLog(state.id, state.accessToken)
  const {
    status,
    isLoading: isStatusLoading,
    isError: isStatusError,
  } = useStatus(state.id, state.accessToken)

  useEffect(() => {
    if (!isStatusLoading && !isStatusError) {
      window.vscode.postMessage({
        command: 'changeStatus',
        text: status.readyState,
      })
    }
  }, [status])

  if (isLoading) {
    return <span>loading...</span>
  }

  if (isError) {
    return <span>Error</span>
  }

  return (
    <table
      style={{
        borderCollapse: 'collapse',
      }}
    >
      {(log ?? [])
        .filter((x) => x.type === 'stdout')
        .map((x) => {
          return (
            <tr>
              <td
                style={{
                  display: 'table',
                  marginRight: '24px',
                }}
              >
                {getTime(x.created)}
              </td>
              <td className="log-text">{x.payload.text}</td>
            </tr>
          )
        })}
    </table>
  )
}

export default App
