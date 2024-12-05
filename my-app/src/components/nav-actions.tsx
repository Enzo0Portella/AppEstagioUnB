"use client"

import * as React from "react"
import {
  ArrowDown,
  ArrowUp,
  Bell,
  Copy,
  CornerUpLeft,
  CornerUpRight,
  FileText,
  GalleryVerticalEnd,
  Grid,
  LineChart,
  Link,
  List,
  Plus,
  Rows4,
  Trash,
  Trash2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { InsectFormDialog } from "@/components/insect-form-dialog"

export type ViewMode = "grid" | "list"

interface NavActionsProps {
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  onNewInsect?: () => void
}

interface InsectFormData {
  id?: number
  nome: string
  localColeta: string
  dataColeta: Date | undefined
  nomeColetor: string
  tag: string
  familia: string
  genero: string
  ordem: string
}

export function NavActions({ viewMode, onViewModeChange, onNewInsect }: NavActionsProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [isFormOpen, setIsFormOpen] = React.useState(false)

  const handleNewInsect = () => {
    setIsOpen(false)
    setIsFormOpen(true)
  }

  const handleInsectSubmit = async (data: InsectFormData) => {
    try {
      if (!data.dataColeta) {
        alert('Por favor, selecione uma data');
        return;
      }

      const payload = {
        nome: data.nome,
        localColeta: data.localColeta,
        dataColeta: data.dataColeta.toISOString().split('T')[0],
        nomeColetor: data.nomeColetor,
        tag: data.tag,
        familia: data.familia,
        genero: data.genero,
        ordem: data.ordem,
        id: null
      };

      console.log('Enviando dados:', payload);

      const response = await fetch('http://localhost:8080/api/insetos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ao salvar: ${errorText}`);
      }

      const savedInsect = await response.json();
      console.log('Inseto salvo com sucesso:', savedInsect);
      
      setIsFormOpen(false); // Fecha o formulário após salvar
      // Aqui você pode adicionar uma função de callback para atualizar a lista
      if (onNewInsect) {
        onNewInsect();
      }
    } catch (error) {
      console.error('Erro ao salvar inseto:', error);
      alert('Erro ao salvar o inseto. Verifique o console para mais detalhes.');
    }
  }

  const data = [
    [
      { icon: Plus, label: "Novo Inseto", onClick: handleNewInsect },
      { icon: FileText, label: "Documentos" },
      { icon: LineChart, label: "Relatórios" }
    ],
    [
      { icon: Trash2, label: "Lixeira" }
    ]
  ]

  const toggleViewMode = () => {
    const newMode = viewMode === "grid" ? "list" : "grid"
    onViewModeChange(newMode)
  }

  return (
    <>
      <div className="flex items-center gap-2 text-sm">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={toggleViewMode}
        >
          {viewMode === "grid" ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
        </Button>

        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 data-[state=open]:bg-accent"
            >
              <DotsHorizontalIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-56 overflow-hidden rounded-lg p-0"
            align="end"
          >
            <Sidebar collapsible="none" className="bg-transparent">
              <SidebarContent>
                {data.map((group: any[], groupIndex: number) => (
                  <SidebarGroup key={groupIndex} className="border-b last:border-none">
                    <SidebarGroupContent className="gap-0">
                      <SidebarMenu>
                        {group.map((item: { icon: any, label: string, onClick?: () => void }, itemIndex: number) => (
                          <SidebarMenuItem key={itemIndex}>
                            <SidebarMenuButton onClick={item.onClick}>
                              <item.icon /> <span>{item.label}</span>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        ))}
                      </SidebarMenu>
                    </SidebarGroupContent>
                  </SidebarGroup>
                ))}
              </SidebarContent>
            </Sidebar>
          </PopoverContent>
        </Popover>
      </div>

      <InsectFormDialog 
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleInsectSubmit}
      />
    </>
  )
}
