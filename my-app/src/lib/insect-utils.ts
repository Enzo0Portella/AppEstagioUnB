import { Insect, InsectFormData } from '@/types/insect';

/**
 * Converte um objeto InsectFormData para o formato Insect
 * usado na API
 */
export function formDataToApiInsect(formData: InsectFormData): Omit<Insect, 'id'> | Insect {
  if (!formData.dataColeta) {
    throw new Error('Data de coleta é obrigatória');
  }

  const insectData = {
    nome: formData.nome,
    localColeta: formData.localColeta,
    dataColeta: formData.dataColeta.toISOString().split('T')[0],
    nomeColetor: formData.nomeColetor,
    tag: formData.tag,
    familia: formData.familia,
    genero: formData.genero,
    ordem: formData.ordem
  };

  if (formData.id !== undefined) {
    return {
      ...insectData,
      id: formData.id
    };
  }

  return insectData;
}

/**
 * Converte um objeto Insect da API para o formato InsectFormData
 * usado nos formulários
 */
export function apiInsectToFormData(insect: Insect): InsectFormData {
  return {
    id: insect.id,
    nome: insect.nome,
    localColeta: insect.localColeta,
    dataColeta: new Date(insect.dataColeta),
    nomeColetor: insect.nomeColetor,
    tag: insect.tag,
    familia: insect.familia,
    genero: insect.genero,
    ordem: insect.ordem
  };
}

/**
 * Filtra uma lista de insetos por um termo de busca
 */
export function filterInsectsByTerm(insects: Insect[], searchTerm: string): Insect[] {
  if (!searchTerm) return insects;
  
  const lowerTerm = searchTerm.toLowerCase();
  
  return insects.filter(insect => {
    return (
      insect.nome.toLowerCase().includes(lowerTerm) ||
      insect.ordem.toLowerCase().includes(lowerTerm) ||
      insect.familia.toLowerCase().includes(lowerTerm) ||
      insect.genero.toLowerCase().includes(lowerTerm) ||
      insect.localColeta.toLowerCase().includes(lowerTerm) ||
      insect.nomeColetor.toLowerCase().includes(lowerTerm) ||
      insect.tag.toLowerCase().includes(lowerTerm)
    );
  });
}

/**
 * Obtém estatísticas dos insetos
 */
export function getInsectStats(insects: Insect[]) {
  const stats = {
    total: insects.length,
    byOrder: {} as Record<string, number>,
    byFamily: {} as Record<string, number>,
    byLocation: {} as Record<string, number>,
    byCollector: {} as Record<string, number>
  };
  
  insects.forEach(insect => {
    // Contagem por ordem
    stats.byOrder[insect.ordem] = (stats.byOrder[insect.ordem] || 0) + 1;
    
    // Contagem por família
    stats.byFamily[insect.familia] = (stats.byFamily[insect.familia] || 0) + 1;
    
    // Contagem por local
    stats.byLocation[insect.localColeta] = (stats.byLocation[insect.localColeta] || 0) + 1;
    
    // Contagem por coletor
    stats.byCollector[insect.nomeColetor] = (stats.byCollector[insect.nomeColetor] || 0) + 1;
  });
  
  return stats;
} 