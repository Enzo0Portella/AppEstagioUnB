"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Coletor, ColetorFormData } from "@/types/coletor"

interface ColetorFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit?: (data: ColetorFormData) => void
  onDelete?: () => void
  isEditing?: boolean
  initialData?: Coletor
  isSubmitting?: boolean
}

export function ColetorFormDialog({ 
  open, 
  onOpenChange, 
  onSubmit, 
  onDelete,
  isEditing,
  initialData,
  isSubmitting = false
}: ColetorFormDialogProps) {
  const [formData, setFormData] = React.useState<ColetorFormData>({
    idColetor: undefined,
    nomeColetor: "",
    cpfColetor: ""
  })

  // Formatar CPF para conter apenas números
  const formatCPF = (cpf: string) => {
    return cpf.replace(/\D/g, '');
  }

  React.useEffect(() => {
    if (initialData) {
      setFormData({
        idColetor: initialData.idColetor,
        nomeColetor: initialData.nomeColetor,
        cpfColetor: initialData.cpfColetor
      })
    } else {
      setFormData({
        idColetor: undefined,
        nomeColetor: "",
        cpfColetor: ""
      })
    }
  }, [initialData])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Log para debug
    console.log('Modo do formulário:', isEditing ? 'EDIÇÃO' : 'CRIAÇÃO');
    console.log('Dados iniciais:', initialData);
    console.log('Dados do formulário:', formData);
    
    // Certifique-se de que o CPF contenha apenas números
    const submissionData = {
      ...formData,
      cpfColetor: formatCPF(formData.cpfColetor)
    };
    
    onSubmit?.(submissionData);
    
    // Limpa o formulário apenas se não estiver editando
    if (!isEditing) {
      setFormData({
        idColetor: undefined,
        nomeColetor: "",
        cpfColetor: ""
      });
    }
    
    onOpenChange(false);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    
    if (name === 'cpfColetor') {
      // Formatar o CPF para exibição enquanto o usuário digita (opcional)
      // Mantendo apenas números no estado
      setFormData(prev => ({ 
        ...prev, 
        [name]: formatCPF(value)
      }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto bg-white border border-zinc-800 rounded-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Coletor' : 'Adicionar Novo Coletor'}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Edite os detalhes do coletor abaixo e clique em salvar quando terminar.'
              : 'Preencha os detalhes do novo coletor abaixo e clique em salvar quando terminar.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {isEditing && (
            <div className="space-y-1">
              <Label htmlFor="idColetor">ID do Coletor</Label>
              <Input
                id="idColetor"
                name="idColetor"
                value={formData.idColetor || ''}
                disabled
                className="bg-muted"
              />
            </div>
          )}

          <div className="space-y-1">
            <Label htmlFor="nomeColetor">Nome do Coletor</Label>
            <Input
              id="nomeColetor"
              name="nomeColetor"
              placeholder="Nome completo do coletor"
              value={formData.nomeColetor}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="cpfColetor">CPF do Coletor</Label>
            <Input
              id="cpfColetor"
              name="cpfColetor"
              placeholder="Apenas números do CPF"
              value={formData.cpfColetor}
              onChange={handleChange}
              maxLength={11}
              required
            />
            <p className="text-xs text-muted-foreground">Digite apenas os números do CPF (11 dígitos)</p>
          </div>

          <div className="flex justify-between mt-6">
            {isEditing && onDelete && (
              <Button 
                type="button" 
                variant="destructive" 
                onClick={onDelete}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Aguarde...' : 'Excluir'}
              </Button>
            )}
            <div className="flex justify-end space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button 
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting 
                  ? 'Salvando...' 
                  : isEditing 
                    ? 'Salvar Alterações' 
                    : 'Salvar Coletor'
                }
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 