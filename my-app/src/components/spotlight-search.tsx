"use client"

import * as React from "react"
import { Command } from "cmdk"
import { Search, Filter, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog-search"
import { type Insect } from "@/types/insect"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface SpotlightProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  insects: Insect[]
  onSelect?: (insect: Insect) => void
}

type FilterCategory = "ordem" | "familia" | "localColeta" | "nomeColetor" | "tag" | "all";

export function SpotlightSearch({ open, onOpenChange, insects, onSelect }: SpotlightProps) {
  const [search, setSearch] = React.useState("")
  const [showFilters, setShowFilters] = React.useState(false)
  const [filterCategory, setFilterCategory] = React.useState<FilterCategory>("all")
  const [selectedFilters, setSelectedFilters] = React.useState<Record<string, string>>({})

  // Extrair valores únicos para os filtros avançados
  const uniqueValues = React.useMemo(() => {
    const values = {
      ordem: new Set<string>(),
      familia: new Set<string>(),
      localColeta: new Set<string>(),
      nomeColetor: new Set<string>(),
      tag: new Set<string>(),
    };

    insects.forEach(insect => {
      if (insect.ordem) values.ordem.add(insect.ordem);
      if (insect.familia) values.familia.add(insect.familia);
      if (insect.localColeta) values.localColeta.add(insect.localColeta);
      if (insect.nomeColetor) values.nomeColetor.add(insect.nomeColetor);
      if (insect.tag) values.tag.add(insect.tag);
    });

    return {
      ordem: Array.from(values.ordem).sort(),
      familia: Array.from(values.familia).sort(),
      localColeta: Array.from(values.localColeta).sort(),
      nomeColetor: Array.from(values.nomeColetor).sort(),
      tag: Array.from(values.tag).sort(),
    };
  }, [insects]);

  const filteredInsects = React.useMemo(() => {
    if (!insects) return [];
    
    // Primeiro aplicamos os filtros avançados
    let filtered = insects;
    
    Object.entries(selectedFilters).forEach(([key, value]) => {
      if (value) {
        filtered = filtered.filter(insect => 
          insect[key as keyof Insect]?.toString().toLowerCase() === value.toLowerCase()
        );
      }
    });
    
    // Se não houver termo de busca, retornamos os resultados filtrados
    if (!search.trim()) return filtered;
    
    // Depois aplicamos a busca por texto
    const searchTerms = search.toLowerCase().trim().split(/\s+/);
    
    return filtered.filter(insect => {
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

      // Se estiver filtrando por categoria específica
      if (filterCategory !== "all") {
        return searchTerms.every(term => searchableText[filterCategory]?.includes(term));
      }

      // Caso contrário, busca em todos os campos
      return searchTerms.every(term => {
        const exactMatch = Object.entries(searchableText).some(([field, value]) => {
          if (field === 'all') return false;
          return value.includes(term);
        });

        if (exactMatch) return true;
        return searchableText.all.includes(term);
      });
    });
  }, [insects, search, filterCategory, selectedFilters]);

  const handleSelect = (insect: Insect) => {
    console.log('SpotlightSearch - Inseto selecionado:', insect);
    onSelect?.(insect);
    onOpenChange(false);
  }

  const handleFilterChange = (category: string, value: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [category]: value === "none" ? "" : value
    }));
  }

  const clearFilters = () => {
    setSelectedFilters({});
    setFilterCategory("all");
    setSearch("");
  }

  const highlightMatch = (text: string) => {
    if (!search.trim()) return text;

    const escapedTerms = search
      .trim()
      .split(/\s+/)
      .map(term => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
      .join('|');

    const regex = new RegExp(`(${escapedTerms})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, i) => 
      regex.test(part) ? (
        <mark key={i} className="bg-accent/40 text-accent-foreground rounded-sm px-0.5">
          {part}
        </mark>
      ) : (
        part
      )
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[700px] gap-0 p-0">
        <Command className="rounded-lg border shadow-md">
          <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <Command.Input
              value={search}
              onValueChange={setSearch}
              placeholder="Buscar por nome, ordem, família, local, coletor, tag, data..."
              className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
            />
            <div className="flex items-center gap-1">
              {search && (
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setSearch("")}
                >
                  <X className="h-4 w-4 opacity-50" />
                </Button>
              )}
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className={`h-4 w-4 ${Object.keys(selectedFilters).length > 0 ? 'text-primary' : 'opacity-50'}`} />
              </Button>
            </div>
          </div>

          {showFilters && (
            <div className="p-4 border-b">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium">Filtros avançados</h3>
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Limpar filtros
                </Button>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="ordem-filter" className="text-xs">Ordem</Label>
                  <Select 
                    value={selectedFilters.ordem || "none"} 
                    onValueChange={(value) => handleFilterChange('ordem', value)}
                  >
                    <SelectTrigger id="ordem-filter" className="h-8 mt-1">
                      <SelectValue placeholder="Selecione a ordem" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Todas</SelectItem>
                      {uniqueValues.ordem.map(value => (
                        <SelectItem key={value} value={value}>{value}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="familia-filter" className="text-xs">Família</Label>
                  <Select 
                    value={selectedFilters.familia || "none"} 
                    onValueChange={(value) => handleFilterChange('familia', value)}
                  >
                    <SelectTrigger id="familia-filter" className="h-8 mt-1">
                      <SelectValue placeholder="Selecione a família" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Todas</SelectItem>
                      {uniqueValues.familia.map(value => (
                        <SelectItem key={value} value={value}>{value}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="localColeta-filter" className="text-xs">Local</Label>
                  <Select 
                    value={selectedFilters.localColeta || "none"} 
                    onValueChange={(value) => handleFilterChange('localColeta', value)}
                  >
                    <SelectTrigger id="localColeta-filter" className="h-8 mt-1">
                      <SelectValue placeholder="Selecione o local" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Todos</SelectItem>
                      {uniqueValues.localColeta.map(value => (
                        <SelectItem key={value} value={value}>{value}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          <Tabs defaultValue="todos" className="w-full">
            <div className="border-b px-3 py-2 bg-muted/40">
              <TabsList className="w-full justify-start bg-transparent">
                <TabsTrigger value="todos" className="text-xs rounded-full" onClick={() => setFilterCategory("all")}>
                  Todos
                </TabsTrigger>
                <TabsTrigger value="ordem" className="text-xs rounded-full" onClick={() => setFilterCategory("ordem")}>
                  Ordem
                </TabsTrigger>
                <TabsTrigger value="familia" className="text-xs rounded-full" onClick={() => setFilterCategory("familia")}>
                  Família
                </TabsTrigger>
                <TabsTrigger value="local" className="text-xs rounded-full" onClick={() => setFilterCategory("localColeta")}>
                  Local
                </TabsTrigger>
                <TabsTrigger value="coletor" className="text-xs rounded-full" onClick={() => setFilterCategory("nomeColetor")}>
                  Coletor
                </TabsTrigger>
              </TabsList>
            </div>

            <Command.List className="max-h-[350px] overflow-y-auto p-2">
              {filteredInsects.length === 0 ? (
                <Command.Empty className="p-4 text-sm text-muted-foreground">
                  Nenhum resultado encontrado.
                </Command.Empty>
              ) : (
                <div className="text-xs text-muted-foreground mb-2">
                  {filteredInsects.length} {filteredInsects.length === 1 ? 'resultado' : 'resultados'} encontrados
                </div>
              )}
              
              {filteredInsects.map((insect) => (
                <Command.Item
                  key={insect.id}
                  value={`${insect.nome} ${insect.ordem} ${insect.familia}`}
                  className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer"
                  onSelect={() => handleSelect(insect)}
                >
                  <div className="flex flex-col gap-1 w-full">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">
                        {highlightMatch(insect.nome)}
                      </span>
                      <Badge variant="outline" className="text-xs">ID: {insect.id}</Badge>
                    </div>
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
          </Tabs>
        </Command>
      </DialogContent>
    </Dialog>
  )
} 