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
import { type Insect, type InsectFormData } from "@/types/insect"
import { InsectFormDialog } from "@/components/insect-form-dialog"

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

interface NavMainItemProps {
  title: string
  url?: string
  icon: React.ComponentType
  badge?: string
  isActive?: boolean
  onClick?: () => void
}

export function AppSidebar({ insectData }: { insectData: Insect[] }) {
  const [open, setOpen] = React.useState(false)
  const [selectedInsect, setSelectedInsect] = React.useState<Insect | null>(null)
  const [spotlightOpen, setSpotlightOpen] = React.useState(false)

  // Adicionar atalho de teclado (Command+K ou Ctrl+K)
  useHotkeys('mod+k', (event) => {
    event.preventDefault()
    setSpotlightOpen(true)
  })

  const handleInsectSelect = (insect: Insect) => {
    setSelectedInsect(insect);
  }

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
      <Sidebar className="border-r">
        <SidebarHeader>
          <TeamSwitcher teams={data.teams} />
          <NavMain items={navMainWithHandlers} />
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
        onSelect={handleInsectSelect}
      />

      <InsectFormDialog
        open={!!selectedInsect}
        onOpenChange={(open: boolean) => !open && setSelectedInsect(null)}
        onSubmit={async (data: InsectFormData) => {
          try {
            const response = await fetch(`http://localhost:8080/api/insetos/${selectedInsect?.id}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                ...data,
                dataColeta: data.dataColeta?.toISOString().split('T')[0],
              }),
            });

            if (!response.ok) {
              throw new Error('Erro ao atualizar inseto');
            }

            setSelectedInsect(null);
          } catch (error) {
            console.error('Erro ao atualizar:', error);
          }
        }}
        isEditing={true}
        initialData={selectedInsect ? {
          ...selectedInsect,
          dataColeta: new Date(selectedInsect.dataColeta)
        } : undefined}
      />
    </>
  )
}
