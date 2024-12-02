"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
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

const MAJOR_CITIES = [
    { id: 3550308, nome: "São Paulo", uf: "SP" },
    { id: 3304557, nome: "Rio de Janeiro", uf: "RJ" },
    { id: 5300108, nome: "Brasília", uf: "DF" },
    { id: 2927408, nome: "Salvador", uf: "BA" },
    { id: 2304400, nome: "Fortaleza", uf: "CE" },
    { id: 3106200, nome: "Belo Horizonte", uf: "MG" },
    { id: 1302603, nome: "Manaus", uf: "AM" },
    { id: 4106902, nome: "Curitiba", uf: "PR" },
    { id: 2611606, nome: "Recife", uf: "PE" },
    { id: 4314902, nome: "Porto Alegre", uf: "RS" },
    { id: 1501402, nome: "Belém", uf: "PA" },
    { id: 5208707, nome: "Goiânia", uf: "GO" },
    { id: 3518800, nome: "Guarulhos", uf: "SP" },
    { id: 3509502, nome: "Campinas", uf: "SP" },
    { id: 2111300, nome: "São Luís", uf: "MA" },
    { id: 3304904, nome: "São Gonçalo", uf: "RJ" },
    { id: 2704302, nome: "Maceió", uf: "AL" },
    { id: 3301702, nome: "Duque de Caxias", uf: "RJ" },
    { id: 2408102, nome: "Natal", uf: "RN" },
    { id: 5002704, nome: "Campo Grande", uf: "MS" },
    { id: 2211001, nome: "Teresina", uf: "PI" },
    { id: 3548708, nome: "São Bernardo do Campo", uf: "SP" },
    { id: 3303500, nome: "Nova Iguaçu", uf: "RJ" },
    { id: 2507507, nome: "João Pessoa", uf: "PB" },
    { id: 3547809, nome: "Santo André", uf: "SP" },
    { id: 3534401, nome: "Osasco", uf: "SP" },
    { id: 3549904, nome: "São José dos Campos", uf: "SP" },
    { id: 2607901, nome: "Jaboatão dos Guararapes", uf: "PE" },
    { id: 3543402, nome: "Ribeirão Preto", uf: "SP" },
    { id: 3170206, nome: "Uberlândia", uf: "MG" },
    { id: 3118600, nome: "Contagem", uf: "MG" },
    { id: 3552205, nome: "Sorocaba", uf: "SP" },
    { id: 2800308, nome: "Aracaju", uf: "SE" },
    { id: 2910800, nome: "Feira de Santana", uf: "BA" },
    { id: 5103403, nome: "Cuiabá", uf: "MT" },
    { id: 4209102, nome: "Joinville", uf: "SC" },
    { id: 3136702, nome: "Juiz de Fora", uf: "MG" },
    { id: 4113700, nome: "Londrina", uf: "PR" },
    { id: 5201405, nome: "Aparecida de Goiânia", uf: "GO" },
    { id: 1500800, nome: "Ananindeua", uf: "PA" },
    { id: 1100205, nome: "Porto Velho", uf: "RO" },
    { id: 3205002, nome: "Serra", uf: "ES" },
    { id: 3303302, nome: "Niterói", uf: "RJ" },
    { id: 3300456, nome: "Belford Roxo", uf: "RJ" },
    { id: 3301001, nome: "Campos dos Goytacazes", uf: "RJ" },
    { id: 3305109, nome: "São João de Meriti", uf: "RJ" },
    { id: 4305108, nome: "Caxias do Sul", uf: "RS" },
    { id: 4205407, nome: "Florianópolis", uf: "SC" },
    { id: 3205200, nome: "Vila Velha", uf: "ES" },
    { id: 3529401, nome: "Mauá", uf: "SP" },
    { id: 1600303, nome: "Macapá", uf: "AP" },
    { id: 3549805, nome: "São José do Rio Preto", uf: "SP" },
    { id: 3530607, nome: "Mogi das Cruzes", uf: "SP" },
    { id: 3106705, nome: "Betim", uf: "MG" },
    { id: 3513801, nome: "Diadema", uf: "SP" },
    { id: 2504009, nome: "Campina Grande", uf: "PB" },
    { id: 2609600, nome: "Olinda", uf: "PE" },
    { id: 3510609, nome: "Carapicuíba", uf: "SP" },
    { id: 3538709, nome: "Piracicaba", uf: "SP" },
    { id: 3201308, nome: "Cariacica", uf: "ES" },
    { id: 3506003, nome: "Bauru", uf: "SP" },
    { id: 3143302, nome: "Montes Claros", uf: "MG" },
    { id: 1200401, nome: "Rio Branco", uf: "AC" },
    { id: 5201108, nome: "Anápolis", uf: "GO" },
    { id: 3205309, nome: "Vitória", uf: "ES" },
    { id: 2303709, nome: "Caucaia", uf: "CE" },
    { id: 4314408, nome: "Pelotas", uf: "RS" },
    { id: 3516200, nome: "Franca", uf: "SP" },
    { id: 4202404, nome: "Blumenau", uf: "SC" },
    { id: 4119905, nome: "Ponta Grossa", uf: "PR" },
    { id: 2611101, nome: "Petrolina", uf: "PE" },
    { id: 3170107, nome: "Uberaba", uf: "MG" },
    { id: 1400100, nome: "Boa Vista", uf: "RR" },
    { id: 2610707, nome: "Paulista", uf: "PE" },
    { id: 4316908, nome: "Santa Maria", uf: "RS" },
    { id: 4115200, nome: "Maringá", uf: "PR" },
    { id: 2933307, nome: "Vitória da Conquista", uf: "BA" },
    { id: 2905701, nome: "Camaçari", uf: "BA" },
    { id: 2408003, nome: "Mossoró", uf: "RN" },
    { id: 3548500, nome: "Santos", uf: "SP" },
    { id: 3552502, nome: "Suzano", uf: "SP" },
    { id: 4309209, nome: "Gravataí", uf: "RS" },
    { id: 3525904, nome: "Jundiaí", uf: "SP" },
    { id: 4304606, nome: "Canoas", uf: "RS" },
    { id: 1504422, nome: "Marabá", uf: "PA" },
    { id: 4108304, nome: "Foz do Iguaçu", uf: "PR" },
    { id: 1721000, nome: "Palmas", uf: "TO" },
    { id: 3157807, nome: "Santa Luzia", uf: "MG" },
    { id: 3552809, nome: "Taboão da Serra", uf: "SP" },
    { id: 3127701, nome: "Governador Valadares", uf: "MG" },
    { id: 4323002, nome: "Viamão", uf: "RS" },
    { id: 3552403, nome: "Sumaré", uf: "SP" },
    { id: 2105302, nome: "Imperatriz", uf: "MA" },
    { id: 2307304, nome: "Juazeiro do Norte", uf: "CE" },
    { id: 2604106, nome: "Caruaru", uf: "PE" },
    { id: 3505708, nome: "Barueri", uf: "SP" },
    { id: 3523107, nome: "Itaquaquecetuba", uf: "SP" },
    { id: 3515004, nome: "Embu das Artes", uf: "SP" },
    { id: 3306305, nome: "Volta Redonda", uf: "RJ" },
    { id: 3200607, nome: "Colatina", uf: "ES" },
    { id: 2927408, nome: "Lauro de Freitas", uf: "BA" },
    { id: 3303401, nome: "Petrópolis", uf: "RJ" },
    { id: 3304144, nome: "Queimados", uf: "RJ" },
    { id: 4208203, nome: "Itajaí", uf: "SC" },
    { id: 4202008, nome: "Balneário Camboriú", uf: "SC" },
    { id: 3547809, nome: "São Vicente", uf: "SP" },
    { id: 2605459, nome: "Igarassu", uf: "PE" },
    { id: 4202305, nome: "Biguaçu", uf: "SC" },
    { id: 4104808, nome: "Cascavel", uf: "PR" },
    { id: 3504008, nome: "Araraquara", uf: "SP" },
    { id: 4307003, nome: "Esteio", uf: "RS" },
    { id: 4314801, nome: "Cruz Alta", uf: "RS" },
    { id: 3557203, nome: "Votuporanga", uf: "SP" },
    { id: 3509502, nome: "Bebedouro", uf: "SP" },
    { id: 5208707, nome: "Luziânia", uf: "GO" },
    { id: 3106705, nome: "Betim", uf: "MG" },
    { id: 3510609, nome: "Carapicuíba", uf: "SP" },
    { id: 3303609, nome: "Nova Friburgo", uf: "RJ" },
    { id: 4303004, nome: "Cachoeirinha", uf: "RS" },
    { id: 2927408, nome: "Lauro de Freitas", uf: "BA" },
    { id: 4314408, nome: "Passo Fundo", uf: "RS" },
  ];
  

interface InsectFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit?: (data: InsectFormData) => void
}

interface InsectFormData {
  order: string
  family: string
  location: string
  date: Date | undefined
  author: string
}

export function InsectFormDialog({ open, onOpenChange, onSubmit }: InsectFormDialogProps) {
  const [formData, setFormData] = React.useState<InsectFormData>({
    order: "",
    family: "",
    location: "",
    date: undefined,
    author: ""
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit?.(formData)
    setFormData({ order: "", family: "", location: "", date: undefined, author: "" })
    onOpenChange(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleLocationChange = (value: string) => {
    setFormData(prev => ({ ...prev, location: value }))
  }

  const handleDateChange = (date: Date | undefined) => {
    setFormData(prev => ({ ...prev, date }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-bg">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Inseto</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="order">Ordem</Label>
            <Input
              id="order"
              name="order"
              value={formData.order}
              onChange={handleChange}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="family">Família</Label>
            <Input
              id="family"
              name="family"
              value={formData.family}
              onChange={handleChange}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="location">Localização</Label>
            <Select
              value={formData.location}
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
            <Label htmlFor="date">Data</Label>
            <Input
              id="date"
              name="date"
              type="date"
              value={formData.date ? formData.date.toISOString().split('T')[0] : ''}
              onChange={(e) => handleDateChange(e.target.value ? new Date(e.target.value) : undefined)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="author">Autor</Label>
            <Input
              id="author"
              name="author"
              value={formData.author}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Salvar</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 