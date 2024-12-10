"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MAJOR_CITIES } from "@/types/majocities"
import { type Insect, type InsectFormData } from "@/types/insect"

interface EditInsectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit?: (data: InsectFormData) => void
  onDelete?: () => void
  insect: Insect | null
}

export function EditInsectDialog({ 
  open, 
  onOpenChange, 
  onSubmit, 
  onDelete,
  insect 
}: EditInsectDialogProps) {
  const [formData, setFormData] = React.useState<InsectFormData>({
    id: undefined,
    nome: "",
    localColeta: "",
    dataColeta: undefined,
    nomeColetor: "",
    tag: "",
    familia: "",
    genero: "",
    ordem: ""
  })

  React.useEffect(() => {
    if (insect) {
      setFormData({
        ...insect,
        dataColeta: new Date(insect.dataColeta)
      })
    }
  }, [insect])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!insect?.id) {
      console.error('Tentativa de atualizar sem ID');
      return;
    }

    console.log('Editando inseto:', {
      id: insect.id,
      dadosAtuais: insect,
      novosData: formData
    });

    onSubmit?.({
      ...formData,
      id: insect.id,
      tag: insect.tag // Mantém a tag original
    });
    
    onOpenChange(false);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleLocationChange = (value: string) => {
    setFormData(prev => ({ ...prev, localColeta: value }))
  }

  const handleDateChange = (date: Date | undefined) => {
    setFormData(prev => ({ ...prev, dataColeta: date }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-bg">
        <DialogHeader>
          <DialogTitle>Editar Inseto</DialogTitle>
          <DialogDescription>
            Atualize os dados do inseto
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="nome">Nome</Label>
            <Input
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="localColeta">Local Coleta</Label>
            <Select
              value={formData.localColeta}
              onValueChange={handleLocationChange}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma localização" />
              </SelectTrigger>
              <SelectContent>
                {MAJOR_CITIES.map((city) => (
                  <SelectItem 
                    key={city.id} 
                    value={`${city.nome} - ${city.uf}`}
                  >
                    {city.nome} - {city.uf}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="dataColeta">Data Coleta</Label>
            <Input
              id="dataColeta"
              name="dataColeta"
              type="date"
              value={formData.dataColeta ? formData.dataColeta.toISOString().split('T')[0] : ''}
              onChange={(e) => handleDateChange(e.target.value ? new Date(e.target.value) : undefined)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="nomeColetor">Nome Coletor</Label>
            <Input
              id="nomeColetor"
              name="nomeColetor"
              value={formData.nomeColetor}
              onChange={handleChange}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="tag">Tag</Label>
            <div className="p-2 bg-muted rounded-md text-sm font-mono">
              {formData.tag}
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="familia">Família</Label>
            <Input
              id="familia"
              name="familia"
              value={formData.familia}
              onChange={handleChange}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="genero">Gênero</Label>
            <Input
              id="genero"
              name="genero"
              value={formData.genero}
              onChange={handleChange}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="ordem">Ordem</Label>
            <Input
              id="ordem"
              name="ordem"
              value={formData.ordem}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            {onDelete && (
              <Button 
                type="button" 
                variant="destructive" 
                onClick={() => {
                  onDelete()
                  onOpenChange(false)
                }}
              >
                Excluir
              </Button>
            )}
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              Atualizar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 