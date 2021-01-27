import React, { useState } from 'react'

import { getTime } from './utils/getTime'
import { useLog } from './hooks/useLog'

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
              <td>{x.payload.text}</td>
            </tr>
          )
        })}
    </table>
  )
}

export default App
