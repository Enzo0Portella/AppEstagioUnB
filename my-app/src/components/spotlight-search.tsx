"use client"

import * as React from "react"
import { Command } from "cmdk"
import { Search } from "lucide-react"
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog-search"

interface SpotlightProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  insects: {
    order: string
    family: string
    location: string
    date: string
    author: string
  }[]
}

export function SpotlightSearch({ open, onOpenChange, insects }: SpotlightProps) {
  const [search, setSearch] = React.useState("")

  const filteredInsects = React.useMemo(() => {
    if (!search) return insects
    
    const searchLower = search.toLowerCase()
    return insects.filter(insect => {
      const searchableFields = [
        insect.order,
        insect.family,
        insect.location,
        insect.date,
        insect.author
      ]
      
      return searchableFields.some(field => 
        field.toLowerCase().includes(searchLower)
      )
    })
  }, [insects, search])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[640px] gap-0 p-0 bg-bg">
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
            {filteredInsects.map((insect, index) => (
              <Command.Item
                key={index}
                value={`${insect.order} ${insect.family} ${insect.location} ${insect.date} ${insect.author}`}
                className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
              >
                <div className="flex flex-col">
                  <span className="font-medium">{insect.order} - {insect.family}</span>
                  <span className="text-xs text-muted-foreground">
                    {insect.location} • {insect.date}
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