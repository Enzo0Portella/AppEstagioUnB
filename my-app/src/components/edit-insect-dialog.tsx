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
    ordem: "",
    imagemUrl: ""
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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Inseto</DialogTitle>
          <DialogDescription>
            Edite os detalhes do inseto abaixo e clique em salvar quando terminar.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="nome">Nome</Label>
            <Input
              id="nome"
              name="nome"
              placeholder="Nome do inseto"
              value={formData.nome}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="ordem">Ordem</Label>
            <Input
              id="ordem"
              name="ordem"
              placeholder="Ordem"
              value={formData.ordem}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="familia">Família</Label>
            <Input
              id="familia"
              name="familia"
              placeholder="Família"
              value={formData.familia}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="genero">Gênero</Label>
            <Input
              id="genero"
              name="genero"
              placeholder="Gênero"
              value={formData.genero}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="localColeta">Local de Coleta</Label>
            <Select 
              value={formData.localColeta} 
              onValueChange={handleLocationChange}
            >
              <SelectTrigger id="localColeta">
                <SelectValue placeholder="Selecione uma cidade" />
              </SelectTrigger>
              <SelectContent>
                {MAJOR_CITIES.map(city => (
                  <SelectItem key={city.id} value={`${city.nome}, ${city.uf}`}>
                    {city.nome}, {city.uf}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label htmlFor="nomeColetor">Nome do Coletor</Label>
            <Input
              id="nomeColetor"
              name="nomeColetor"
              placeholder="Nome do coletor"
              value={formData.nomeColetor}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="dataColeta">Data de Coleta</Label>
            <Input
              id="dataColeta"
              name="dataColeta"
              type="date"
              value={formData.dataColeta ? formData.dataColeta.toISOString().split('T')[0] : ''}
              onChange={(e) => {
                const date = e.target.value ? new Date(e.target.value) : undefined;
                handleDateChange(date);
              }}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="tag">Tag</Label>
            <Input
              id="tag"
              name="tag"
              value={formData.tag}
              disabled
              className="bg-muted"
            />
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="imagemUrl">URL da Imagem</Label>
            <Input
              id="imagemUrl"
              name="imagemUrl"
              placeholder="URL da imagem do inseto"
              value={formData.imagemUrl || ''}
              onChange={handleChange}
            />
            <p className="text-xs text-muted-foreground">Insira a URL completa de uma imagem (opcional)</p>
          </div>

          <div className="flex justify-between mt-6">
            {onDelete && (
              <Button type="button" variant="destructive" onClick={onDelete}>
                Excluir
              </Button>
            )}
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                Salvar Alterações
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 