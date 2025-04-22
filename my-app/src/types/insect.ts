/**
 * Interface que representa um inseto no sistema
 */
export interface Insect {
  /** ID único do inseto */
  id: number
  /** Nome do inseto */
  nome: string
  /** Local onde o inseto foi coletado */
  localColeta: string
  /** Data da coleta no formato ISO (YYYY-MM-DD) */
  dataColeta: string
  /** Nome da pessoa que coletou o inseto */
  nomeColetor: string
  /** Tag para identificação adicional */
  tag: string
  /** Família do inseto na taxonomia */
  familia: string
  /** Gênero do inseto na taxonomia */
  genero: string
  /** Ordem do inseto na taxonomia */
  ordem: string
  /** URL da imagem do inseto (opcional) */
  imagemUrl?: string
  /** ID do coletor responsável pela coleta */
  idColetor: number
}

/**
 * Interface para o formulário de inseto
 * Usada para criar e editar insetos
 */
export interface InsectFormData {
  /** ID do inseto, opcional para criação */
  id?: number
  /** Nome do inseto */
  nome: string
  /** Local onde o inseto foi coletado */
  localColeta: string
  /** Data da coleta como objeto Date */
  dataColeta: Date | undefined
  /** Nome da pessoa que coletou o inseto */
  nomeColetor: string
  /** Tag para identificação adicional */
  tag: string
  /** Família do inseto na taxonomia */
  familia: string
  /** Gênero do inseto na taxonomia */
  genero: string
  /** Ordem do inseto na taxonomia */
  ordem: string
  /** URL da imagem do inseto (opcional) */
  imagemUrl?: string
  /** ID do coletor na base de dados */
  idColetor: number
} 