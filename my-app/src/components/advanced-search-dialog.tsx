"use client"

import * as React from "react";
import { Dialog, DialogContentNoClose } from "@/components/ui/dialog-search";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Search, Filter } from "lucide-react";
import { type Insect } from "@/types/insect";

interface AdvancedSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  insects: Insect[];
  onSelect?: (insect: Insect) => void;
}

type FilterCategory = "ordem" | "familia" | "localColeta" | "nomeColetor" | "tag" | "all";

export function AdvancedSearchDialog({ open, onOpenChange, insects, onSelect }: AdvancedSearchDialogProps) {
  const [search, setSearch] = React.useState("");
  const [showFilters, setShowFilters] = React.useState(false);
  const [filterCategory, setFilterCategory] = React.useState<FilterCategory>("all");
  const [selectedFilters, setSelectedFilters] = React.useState<Record<string, string>>({});

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
    let filtered = insects;
    Object.entries(selectedFilters).forEach(([key, value]) => {
      if (value) {
        filtered = filtered.filter(insect => 
          insect[key as keyof Insect]?.toString().toLowerCase() === value.toLowerCase()
        );
      }
    });
    if (!search.trim()) return filtered;
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
        dataColeta: new Date(insect.dataColeta).toLocaleDateString('pt-BR').toLowerCase(),
        all: `${insect.nome} ${insect.ordem} ${insect.familia} ${insect.localColeta} ${insect.nomeColetor} ${insect.tag} ${insect.genero} ${new Date(insect.dataColeta).toLocaleDateString('pt-BR')}`.toLowerCase()
      };
      if (filterCategory !== "all") {
        return searchTerms.every(term => searchableText[filterCategory]?.includes(term));
      }
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
    onSelect?.(insect);
    onOpenChange(false);
  };

  const handleFilterChange = (category: string, value: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [category]: value === "none" ? "" : value
    }));
  };

  const clearFilters = () => {
    setSelectedFilters({});
    setFilterCategory("all");
    setSearch("");
  };

  const highlightMatch = (text: string) => {
    const safeText = text || "";
    if (!search.trim()) return safeText;
    const escapedTerms = search
      .trim()
      .split(/\s+/)
      .map(term => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
      .join('|');
    const regex = new RegExp(`(${escapedTerms})`, 'gi');
    const parts = safeText.split(regex);
    return parts.map((part, i) => 
      regex.test(part) ? (
        <mark key={i} className="bg-yellow-200 text-yellow-900 rounded-sm px-0.5">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContentNoClose className="max-w-[700px] bg-white border border-zinc-200 shadow-xl rounded-xl p-0">
        <div className="rounded-t-xl border-b bg-zinc-100 px-4 py-3 flex items-center gap-2">
          <Search className="h-5 w-5 text-zinc-500" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por nome, ordem, família, local, coletor, tag, data..."
            className="flex-1 bg-white border-none focus:ring-0 focus-visible:ring-0 shadow-none text-base"
          />
          {search && (
            <Button variant="ghost" size="icon" onClick={() => setSearch("")}
              className="text-zinc-400 hover:text-zinc-700">
            </Button>
          )}
          <Button variant="outline" size="icon" onClick={() => setShowFilters(!showFilters)}
            className={showFilters || Object.keys(selectedFilters).length > 0 ? "border-primary text-primary" : "border-zinc-200 text-zinc-500"}>
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        {showFilters && (
          <div className="bg-zinc-50 border-b px-4 py-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium">Filtros avançados</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <Label htmlFor="ordem-filter" className="text-xs">Ordem</Label>
                <Select value={selectedFilters.ordem || "none"} onValueChange={value => handleFilterChange('ordem', value)}>
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
                <Select value={selectedFilters.familia || "none"} onValueChange={value => handleFilterChange('familia', value)}>
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
                <Select value={selectedFilters.localColeta || "none"} onValueChange={value => handleFilterChange('localColeta', value)}>
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
          <div className="border-b px-4 py-2 bg-zinc-50">
            <TabsList className="w-full justify-start bg-transparent">
              <TabsTrigger value="todos" className="text-xs rounded-full" onClick={() => setFilterCategory("all")}>Todos</TabsTrigger>
              <TabsTrigger value="ordem" className="text-xs rounded-full" onClick={() => setFilterCategory("ordem")}>Ordem</TabsTrigger>
              <TabsTrigger value="familia" className="text-xs rounded-full" onClick={() => setFilterCategory("familia")}>Família</TabsTrigger>
              <TabsTrigger value="local" className="text-xs rounded-full" onClick={() => setFilterCategory("localColeta")}>Local</TabsTrigger>
              <TabsTrigger value="coletor" className="text-xs rounded-full" onClick={() => setFilterCategory("nomeColetor")}>Coletor</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="todos" className="p-0">
            <div className="max-h-[350px] overflow-y-auto p-2 bg-white">
              {filteredInsects.length === 0 ? (
                <div className="p-4 text-sm text-zinc-500 text-center">Nenhum resultado encontrado.</div>
              ) : (
                <div className="text-xs text-zinc-500 mb-2">{filteredInsects.length} {filteredInsects.length === 1 ? 'resultado' : 'resultados'} encontrados</div>
              )}
              {filteredInsects.map((insect) => (
                <div
                  key={insect.id}
                  className="flex flex-col gap-1 rounded-md border border-zinc-100 bg-zinc-50 hover:bg-zinc-100 transition px-3 py-2 mb-2 cursor-pointer shadow-sm"
                  onClick={() => handleSelect(insect)}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-zinc-800 text-base">{highlightMatch(insect.nome)}</span>
                    <Badge variant="outline" className="text-xs">ID: {insect.id}</Badge>
                  </div>
                  <span className="text-xs text-zinc-600">{highlightMatch(`${insect.ordem} - ${insect.familia}`)} • {highlightMatch(insect.localColeta)}</span>
                  <span className="text-xs text-zinc-600">Data: {highlightMatch(new Date(insect.dataColeta).toLocaleDateString('pt-BR'))}</span>
                  <span className="text-xs text-zinc-600">Coletor: {highlightMatch(insect.nomeColetor)} • Tag: {highlightMatch(insect.tag)}</span>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContentNoClose>
    </Dialog>
  );
} 