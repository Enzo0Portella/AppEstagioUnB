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
  Plus,
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
import { useInsects } from '@/hooks/useInsects'
import { InsectFormDialog } from "@/components/insect-form-dialog"

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
      url: "/dashboard",
      icon: Snail,
      isActive: true,
    },
    {
      title: "Favoritos",
      url: "#",
      icon: BookMarked,
      badge: "10",
    },
    {
      title: "Novo Inseto",
      icon: Plus,
    },
    {
      title: "Coletores",
      url: "/coletores",
      icon: SquareUserRound,
    }
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

export function AppSidebar({ insectData }: { insectData?: Insect[] }) {
  const [spotlightOpen, setSpotlightOpen] = React.useState(false)
  const [selectedInsect, setSelectedInsect] = React.useState<Insect | null>(null)
  const [newInsectFormOpen, setNewInsectFormOpen] = React.useState(false)
  const { editInsect, addInsect } = useInsects();

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

  const handleNewInsectClick = () => {
    console.log('AppSidebar - Abrindo formulário de novo inseto');
    setNewInsectFormOpen(true);
  }

  const navMainWithHandlers = data.navMain.map(item => {
    if (item.title === "Buscar") {
      return {
        ...item,
        onClick: handleSearchClick
      }
    }
    if (item.title === "Novo Inseto") {
      return {
        ...item,
        onClick: handleNewInsectClick
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

      const updatedData = {
        ...data,
        id: selectedInsect.id
      };

      const result = await editInsect(updatedData);
      
      if (result) {
        console.log('AppSidebar - Inseto atualizado com sucesso:', result);
        setSelectedInsect(null);
        window.location.reload();
      }
    } catch (error) {
      console.error('Erro ao atualizar:', error);
      alert('Erro ao atualizar o inseto');
    }
  }
  
  const handleCreateInsect = async (formData: InsectFormData) => {
    try {
      const result = await addInsect(formData);
      
      if (result) {
        console.log('Novo inseto criado:', result);
        setNewInsectFormOpen(false);
        window.location.reload();
      }
    } catch (error) {
      console.error('Erro ao criar inseto:', error);
      alert('Erro ao criar o inseto');
    }
  };

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
        insects={insectData || []}
        onSelect={handleInsectSelect}
      />

      <EditInsectDialog
        open={!!selectedInsect}
        onOpenChange={(open) => !open && setSelectedInsect(null)}
        onSubmit={handleUpdateInsect}
        insect={selectedInsect}
      />
      
      <InsectFormDialog 
        open={newInsectFormOpen}
        onOpenChange={setNewInsectFormOpen}
        onSubmit={handleCreateInsect}
      />
    </>
  )
}
