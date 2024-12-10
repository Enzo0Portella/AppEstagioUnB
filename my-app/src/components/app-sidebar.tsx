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
  SquareUserRound,
  Trash2,
  User,
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
import { EditInsectDialog } from "@/components/edit-insect-dialog"

const data = {
  teams: [
    {
      name: "UNB team",
      logo: User,
      plan: "Enterprise",
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
  const [spotlightOpen, setSpotlightOpen] = React.useState(false)
  const [selectedInsect, setSelectedInsect] = React.useState<Insect | null>(null)

  useHotkeys('mod+k', (event) => {
    event.preventDefault()
    setSpotlightOpen(true)
  })

  const handleInsectSelect = (insect: Insect) => {
    console.log('AppSidebar - Abrindo inseto para edição:', insect);
    setSelectedInsect(insect);
  }

  const handleSearchClick = () => {
    console.log('AppSidebar - Abrindo busca');
    setSpotlightOpen(true);
  }

  const navMainWithHandlers = data.navMain.map(item => {
    if (item.title === "Buscar") {
      return {
        ...item,
        onClick: handleSearchClick
      }
    }
    return item
  })

  const handleUpdateInsect = async (data: InsectFormData) => {
    try {
      if (!selectedInsect?.id) {
        console.error('Tentativa de atualizar sem ID');
        return;
      }

      const payload = {
        nome: data.nome,
        localColeta: data.localColeta,
        dataColeta: data.dataColeta?.toISOString().split('T')[0],
        nomeColetor: data.nomeColetor,
        tag: data.tag,
        familia: data.familia,
        genero: data.genero,
        ordem: data.ordem,
        id: selectedInsect.id
      };

      console.log('AppSidebar - Enviando atualização:', payload);

      const response = await fetch('http://localhost:8080/api/insetos', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar inseto');
      }

      const updatedInsect = await response.json();
      console.log('AppSidebar - Inseto atualizado com sucesso:', updatedInsect);
      
      setSelectedInsect(null);
      window.location.reload();
    } catch (error) {
      console.error('Erro ao atualizar:', error);
      alert('Erro ao atualizar o inseto');
    }
  }

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

      <EditInsectDialog
        open={!!selectedInsect}
        onOpenChange={(open) => !open && setSelectedInsect(null)}
        onSubmit={handleUpdateInsect}
        insect={selectedInsect}
      />
    </>
  )
}
