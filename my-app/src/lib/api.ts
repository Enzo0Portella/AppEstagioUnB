import { Insect } from '@/types/insect';
import { API_ENDPOINTS, DEFAULT_HEADERS } from './api-config';

interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

// Função para tratar erros de forma consistente
const handleApiError = async (response: Response): Promise<string> => {
  try {
    const errorData = await response.json();
    return errorData.message || response.statusText || 'Erro desconhecido';
  } catch (error) {
    return response.statusText || 'Erro desconhecido';
  }
};

// Buscar todos os insetos
export async function fetchAllInsects(): Promise<ApiResponse<Insect[]>> {
  try {
    const response = await fetch(API_ENDPOINTS.INSECTS);
    
    if (!response.ok) {
      const errorMessage = await handleApiError(response);
      return { data: null, error: errorMessage };
    }
    
    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    console.error('Erro ao buscar insetos:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error.message : 'Erro desconhecido ao buscar insetos' 
    };
  }
}

// Buscar um inseto por ID
export async function fetchInsectById(id: number): Promise<ApiResponse<Insect>> {
  try {
    const response = await fetch(`${API_ENDPOINTS.INSECTS}/${id}`);
    
    if (!response.ok) {
      const errorMessage = await handleApiError(response);
      return { data: null, error: errorMessage };
    }
    
    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    console.error(`Erro ao buscar inseto com ID ${id}:`, error);
    return { 
      data: null, 
      error: error instanceof Error ? error.message : 'Erro desconhecido ao buscar inseto'
    };
  }
}

// Criar um novo inseto
export async function createInsect(insect: Omit<Insect, 'id'>): Promise<ApiResponse<Insect>> {
  try {
    const response = await fetch(API_ENDPOINTS.INSECTS, {
      method: 'POST',
      headers: DEFAULT_HEADERS,
      body: JSON.stringify({ ...insect, id: null })
    });
    
    if (!response.ok) {
      const errorMessage = await handleApiError(response);
      return { data: null, error: errorMessage };
    }
    
    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    console.error('Erro ao criar inseto:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error.message : 'Erro desconhecido ao criar inseto'
    };
  }
}

// Atualizar um inseto existente
export async function updateInsect(insect: Insect): Promise<ApiResponse<Insect>> {
  try {
    const response = await fetch(API_ENDPOINTS.INSECTS, {
      method: 'PUT',
      headers: DEFAULT_HEADERS,
      body: JSON.stringify(insect)
    });
    
    if (!response.ok) {
      const errorMessage = await handleApiError(response);
      return { data: null, error: errorMessage };
    }
    
    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    console.error(`Erro ao atualizar inseto com ID ${insect.id}:`, error);
    return { 
      data: null, 
      error: error instanceof Error ? error.message : 'Erro desconhecido ao atualizar inseto'
    };
  }
}

// Excluir um inseto
export async function deleteInsect(id: number): Promise<ApiResponse<boolean>> {
  try {
    const response = await fetch(`${API_ENDPOINTS.INSECTS}/${id}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      const errorMessage = await handleApiError(response);
      return { data: null, error: errorMessage };
    }
    
    return { data: true, error: null };
  } catch (error) {
    console.error(`Erro ao excluir inseto com ID ${id}:`, error);
    return { 
      data: null, 
      error: error instanceof Error ? error.message : 'Erro desconhecido ao excluir inseto'
    };
  }
} 