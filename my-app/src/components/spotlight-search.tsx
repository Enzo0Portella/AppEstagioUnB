"use client"

import * as React from "react"
import { Command } from "cmdk"
import { Search } from "lucide-react"
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog-search"

interface Insect {
  id: number
  nome: string
  localColeta: string
  dataColeta: string
  nomeColetor: string
  tag: string
  familia: string
  genero: string
  ordem: string
}

interface SpotlightProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  insects: Insect[]
  onSelect?: (insect: Insect) => void
}

export function SpotlightSearch({ open, onOpenChange, insects, onSelect }: SpotlightProps) {
  const [search, setSearch] = React.useState("")
  const [selectedInsect, setSelectedInsect] = React.useState<Insect | null>(null)

  const filteredInsects = React.useMemo(() => {
    if (!search || !insects) return insects || []
    
    const searchLower = search.toLowerCase()
    return insects.filter(insect => {
      const searchableFields = [
        insect.nome,
        insect.ordem,
        insect.familia,
        insect.localColeta,
        insect.nomeColetor,
        insect.tag,
        insect.genero
      ]
      
      return searchableFields.some(field => 
        field?.toLowerCase().includes(searchLower)
      )
    })
  }, [insects, search])

  const handleSelect = (insect: Insect) => {
    onSelect?.(insect);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[640px] gap-0 p-0 bg-sidebar">
        <Command className="rounded-lg border shadow-md">
          <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <Command.Input
              value={search}
              onValueChange={setSearch}
              placeholder="Buscar insetos..."
              className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          <Command.List className="max-h-[300px] overflow-y-auto p-2">
            <Command.Empty className="p-4 text-sm text-muted-foreground">
              Nenhum resultado encontrado.
            </Command.Empty>
            {filteredInsects.map((insect) => (
              <Command.Item
                key={insect.id}
                value={`${insect.nome} ${insect.ordem} ${insect.familia}`}
                className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer"
                onSelect={() => handleSelect(insect)}
              >
                <div className="flex flex-col">
                  <span className="font-medium">{insect.nome}</span>
                  <span className="text-xs text-muted-foreground">
                    {insect.ordem} - {insect.familia} • {insect.localColeta}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Coletor: {insect.nomeColetor} • Tag: {insect.tag}
                  </span>
                </div>
              </Command.Item>
            ))}
          </Command.List>
        </Command>
      </DialogContent>
    </Dialog>
  )
} 