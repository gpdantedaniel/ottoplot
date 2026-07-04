// src/components/icon-rail.jsx

import { Bot, Folder, Settings } from "lucide-react"

import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { Separator } from "@/components/ui/separator"

const navigationItems = [
  {
    value: "workspaces",
    label: "Workspaces",
    icon: Folder,
  },
  {
    value: "model",
    label: "Model Configuration",
    icon: Bot,
  },
  {
    value: "settings",
    label: "Settings",
    icon: Settings,
  },
]

export function IconRail({ activeScreen, onScreenChange }) {
  return (
    <aside className="flex w-16 shrink-0 flex-col items-center gap-3 border-r border-zinc-200 bg-zinc-100 px-3 py-4">
      <TooltipProvider delayDuration={150}>
        <ToggleGroup
          type="single"
          orientation="vertical"
          value={activeScreen}
          onValueChange={(value) => {
            // Prevents deselecting everything when clicking the active icon again.
            if (value) {
              onScreenChange(value)
            }
          }}
          className="flex flex-col gap-3"
        >
          {navigationItems.map((item, index) => {
            const Icon = item.icon

            return (
              <div key={item.value} className="flex flex-col items-center gap-3">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <ToggleGroupItem
                      value={item.value}
                      aria-label={item.label}
                      title={item.label}
                      className="
                        relative h-10 w-10 rounded-lg border border-transparent text-zinc-500
                        transition-all duration-150
                        hover:border-zinc-300 hover:bg-white hover:text-zinc-950
                        focus-visible:ring-2 focus-visible:ring-zinc-400
                        data-[state=on]:border-zinc-800
                        data-[state=on]:bg-zinc-900
                        data-[state=on]:text-zinc-50
                        data-[state=on]:shadow-sm
                        before:absolute before:-left-3 before:top-1/2 before:h-6 before:w-1
                        before:-translate-y-1/2 before:rounded-full before:bg-zinc-900
                        before:opacity-0 before:transition-opacity
                        data-[state=on]:before:opacity-100
                      "
                    >
                      <Icon size={22} />
                    </ToggleGroupItem>
                  </TooltipTrigger>

                  <TooltipContent side="right">
                    {item.label}
                  </TooltipContent>
                </Tooltip>

                {index < navigationItems.length - 1 && (
                  <Separator className="w-8" />
                )}
              </div>
            )
          })}
        </ToggleGroup>
      </TooltipProvider>
    </aside>
  )
}