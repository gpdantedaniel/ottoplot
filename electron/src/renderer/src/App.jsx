import { useState } from "react"

import { IconRail } from "./components/icon-rail"
import { WorkspacesScreen } from "./screens/workspaces-screen"
import { ModelConfigurationScreen } from "./screens/model-configuration-screen"
import { SettingsScreen } from "./screens/settings-screen"

function App() {
  const [activeScreen, setActiveScreen] = useState("workspaces")

  return (
    <div className="flex h-screen w-full flex-row overflow-hidden border-t border-zinc-200">
      <IconRail
        activeScreen={activeScreen}
        onScreenChange={setActiveScreen}
      />

      <ScreenViewport activeScreen={activeScreen} />
    </div>
  )
}

function ScreenViewport({ activeScreen }) {
  return (
    <div className="min-w-0 flex-1">
      <WorkspacesScreen
        isActive={activeScreen === "workspaces"}
      />

      <ModelConfigurationScreen
        isActive={activeScreen === "model"}
      />

      <SettingsScreen
        isActive={activeScreen === "settings"}
      />
    </div>
  )
}

export default App