/**
 * Interface que representa um coletor no sistema
 */
export interface Coletor {
  /** ID único do coletor */
  idColetor: number
  /** Nome do coletor */
  nomeColetor: string
  /** CPF do coletor (apenas números) */
  cpfColetor: string
}

/**
 * Interface para o formulário de coletor
 * Usada para criar e editar coletores
 */
export interface ColetorFormData {
  /** ID do coletor, gerado automaticamente na criação */
  idColetor?: number
  /** Nome do coletor */
  nomeColetor: string
  /** CPF do coletor (apenas números) */
  cpfColetor: string
} 