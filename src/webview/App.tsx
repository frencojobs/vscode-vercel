import React, { useState } from 'react'

declare global {
  interface Window {
    vscode: {
      getState: () => any
      setState: (state: any) => void
      postMessage: (message: any) => void
    }
  }
}

// eslint-disable-next-line @typescript-eslint/naming-convention
const App: React.FC = () => {
  const [count, setCount] = useState(0)

  return (
    <div>
      {window.vscode.getState().id as number}
      <button onClick={() => setCount(count + 1)}>count = {count}!</button>
    </div>
  )
}

export default App
