export interface Insect {
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

export interface InsectFormData {
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