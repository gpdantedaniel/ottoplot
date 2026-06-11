import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from '@/components/ui/button'

function App() {
  const ipcHandle = () => window.electron.ipcRenderer.send('ping')

  return (
    <div className="bg-red-500 w-full h-full flex flex-row">

      <div className="flex-auto bg-blue-500 flex flex-col">
        <div className="flex-2">
          Workspace 1
        </div>
        <div className="flex-1 bg-red-500">
          Workspace 2
        </div>
      </div>
      <div className="w-md bg-green-500">
        Side Panel
      </div>
    </div>
  )
}

export default App
