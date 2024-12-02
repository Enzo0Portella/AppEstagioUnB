"use client"

import * as React from "react"
import {
  AudioWaveform,
  Blocks,
  BookMarked,
  Calendar,
  Command,
  Home,
  Inbox,
  MessageCircleQuestion,
  Search,
  Settings2,
  Snail,
  Sparkles,
  Trash2,
} from "lucide-react"

import { NavFavorites } from "@/components/nav-favorites"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavWorkspaces } from "@/components/nav-workspaces"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { SpotlightSearch } from "@/components/spotlight-search"
import { useHotkeys } from "react-hotkeys-hook"

const data = {
  teams: [
    {
      name: "Acme Inc",
      logo: Command,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Buscar",
      icon: Search,
    },
    {
      title: "Home",
      url: "#",
      icon: Snail,
      isActive: true,
    },
    {
      title: "Favoritos",
      url: "#",
      icon: BookMarked,
      badge: "10",
    },
  ],
  navSecondary: [
    {
      title: "Calendar",
      url: "#",
      icon: Calendar,
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
    },
    {
      title: "Help",
      url: "#",
      icon: MessageCircleQuestion,
    },
  ],
  favorites: [
  ],
  workspaces: [
  ],
}

export function AppSidebar({ 
  insectData = [],
  ...props 
}: React.ComponentProps<typeof Sidebar> & { insectData?: any[] }) {
  const [spotlightOpen, setSpotlightOpen] = React.useState(false)

  // Adicionar atalho de teclado (Command+K ou Ctrl+K)
  useHotkeys('mod+k', (event) => {
    event.preventDefault()
    setSpotlightOpen(true)
  })

  const handleSearchClick = () => {
    setSpotlightOpen(true)
  }

  // Modificar o data.navMain para incluir o handler do click
  const navMainWithHandlers = data.navMain.map(item => {
    if (item.title === "Buscar") {
      return {
        ...item,
        onClick: handleSearchClick
      }
    }
    return item
  })

  return (
    <>
      <Sidebar className="border-r-0" {...props}>
        <SidebarHeader>
          <TeamSwitcher teams={data.teams} />
          <NavMain items={navMainWithHandlers as NavMainItemProps[]} />
        </SidebarHeader>
        <SidebarContent>
          <NavSecondary items={data.navSecondary} className="mt-auto" />
        </SidebarContent>
        <SidebarRail />
      </Sidebar>

      <SpotlightSearch 
        open={spotlightOpen}
        onOpenChange={setSpotlightOpen}
        insects={insectData}
      />
    </>
  )
}
