"use client"

import * as React from "react"
import { Command } from "cmdk"
import { Search } from "lucide-react"
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog-search"
import { type Insect } from "@/types/insect"

interface SpotlightProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  insects: Insect[]
  onSelect?: (insect: Insect) => void
}

export function SpotlightSearch({ open, onOpenChange, insects, onSelect }: SpotlightProps) {
  const [search, setSearch] = React.useState("")

  const filteredInsects = React.useMemo(() => {
    if (!search || !insects) return insects || []
    
    const searchTerms = search.toLowerCase().trim().split(/\s+/)
    
    return insects.filter(insect => {
      const searchableText = {
        nome: insect.nome?.toLowerCase() || '',
        ordem: insect.ordem?.toLowerCase() || '',
        familia: insect.familia?.toLowerCase() || '',
        localColeta: insect.localColeta?.toLowerCase() || '',
        nomeColetor: insect.nomeColetor?.toLowerCase() || '',
        tag: insect.tag?.toLowerCase() || '',
        genero: insect.genero?.toLowerCase() || '',
        dataColeta: new Date(insect.dataColeta).toLocaleDateString().toLowerCase(),
        all: `${insect.nome} ${insect.ordem} ${insect.familia} ${insect.localColeta} ${insect.nomeColetor} ${insect.tag} ${insect.genero} ${new Date(insect.dataColeta).toLocaleDateString()}`.toLowerCase()
      }

      return searchTerms.every(term => {
        const exactMatch = Object.entries(searchableText).some(([field, value]) => {
          if (field === 'all') return false
          return value.includes(term)
        })

        if (exactMatch) return true
        return searchableText.all.includes(term)
      })
    })
  }, [insects, search])

  const handleSelect = (insect: Insect) => {
    console.log('SpotlightSearch - Inseto selecionado:', insect);
    onSelect?.(insect);
    onOpenChange(false);
  }

  const highlightMatch = (text: string) => {
    if (!search.trim()) return text

    const escapedTerms = search
      .trim()
      .split(/\s+/)
      .map(term => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
      .join('|')

    const regex = new RegExp(`(${escapedTerms})`, 'gi')
    const parts = text.split(regex)

    return parts.map((part, i) => 
      regex.test(part) ? (
        <mark key={i} className="bg-yellow-200 rounded-sm px-0.5">
          {part}
        </mark>
      ) : (
        part
      )
    )
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
              placeholder="Buscar por nome, ordem, família, local, coletor, tag, data..."
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
                <div className="flex flex-col gap-1">
                  <span className="font-medium">
                    {highlightMatch(insect.nome)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {highlightMatch(`${insect.ordem} - ${insect.familia}`)} • {highlightMatch(insect.localColeta)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Data: {highlightMatch(new Date(insect.dataColeta).toLocaleDateString())}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Coletor: {highlightMatch(insect.nomeColetor)} • Tag: {highlightMatch(insect.tag)}
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