import { useState, useEffect, useCallback } from 'react';
import { Coletor, ColetorFormData } from '@/types/coletor';
import { API_ENDPOINTS, DEFAULT_HEADERS } from '@/lib/api-config';

// URL base da API para os coletores
const API_URL = API_ENDPOINTS.COLLECTORS;

export const useColetores = () => {
  const [coletores, setColetores] = useState<Coletor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Buscar todos os coletores
  const fetchColetores = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(API_URL);
      
      if (!response.ok) {
        throw new Error(`Erro ao buscar coletores: ${response.status}`);
      }
      
      const data = await response.json();
      setColetores(data);
    } catch (err) {
      console.error('Erro ao buscar coletores:', err);
      setError((err as Error).message || 'Erro ao buscar coletores.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Buscar um coletor por ID
  const fetchColetorById = useCallback(async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/${id}`);
      
      if (!response.ok) {
        throw new Error(`Erro ao buscar coletor: ${response.status}`);
      }
      
      return await response.json();
    } catch (err) {
      console.error(`Erro ao buscar coletor ${id}:`, err);
      throw err;
    }
  }, []);

  // Criar um novo coletor
  const createColetor = useCallback(async (coletorData: ColetorFormData) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: DEFAULT_HEADERS,
        body: JSON.stringify(coletorData),
      });
      
      if (!response.ok) {
        throw new Error(`Erro ao criar coletor: ${response.status}`);
      }
      
      // Verifica se há conteúdo na resposta
      const contentType = response.headers.get('content-type');
      let novoColetor: Coletor;
      
      if (contentType && contentType.includes('application/json')) {
        try {
          novoColetor = await response.json();
        } catch (e) {
          // Se não conseguir fazer parsing do JSON, busca os coletores novamente
          await fetchColetores();
          // Retorna um objeto básico representando sucesso
          return { success: true, message: 'Coletor criado com sucesso' };
        }
      } else {
        // Se a resposta não for JSON, busca os coletores novamente
        await fetchColetores();
        // Retorna um objeto básico representando sucesso
        return { success: true, message: 'Coletor criado com sucesso' };
      }
      
      // Se chegou aqui, temos um objeto coletor válido
      setColetores(prev => [...prev, novoColetor]);
      return novoColetor;
    } catch (err) {
      console.error('Erro ao criar coletor:', err);
      throw err;
    }
  }, [fetchColetores]);

  // Atualizar um coletor existente
  const updateColetor = async (coletor: Coletor): Promise<Coletor | boolean> => {
    try {
      // Garante que todos os campos estejam presentes na requisição
      const coletorCompleto = {
        idColetor: coletor.idColetor,
        nomeColetor: coletor.nomeColetor,
        cpfColetor: coletor.cpfColetor
      };

      console.log('Enviando atualização para URL:', API_URL);
      console.log('Método HTTP:', 'PUT');
      console.log('Payload:', JSON.stringify(coletorCompleto));
      
      // Não inclui o ID na URL, apenas no payload
      const response = await fetch(`${API_URL}`, {
        method: 'PUT',
        headers: DEFAULT_HEADERS,
        body: JSON.stringify(coletorCompleto),
      });

      console.log('Status da resposta:', response.status);
      
      if (!response.ok) {
        throw new Error(`Erro ao atualizar coletor: ${response.status}`);
      }

      // Verifica se a resposta inclui conteúdo antes de tentar fazer parse
      const contentType = response.headers.get('Content-Type');
      if (contentType && contentType.includes('application/json')) {
        try {
          const updatedColetor = await response.json();
          
          // Atualiza o estado com o coletor atualizado
          setColetores(prev => 
            prev.map(c => c.idColetor === coletor.idColetor ? updatedColetor : c)
          );
          
          return updatedColetor;
        } catch (e) {
          // Falha no parse JSON, mas a operação pode ter sido bem-sucedida
          console.log('Resposta não-JSON recebida, mas operação pode ter sido bem-sucedida');
          // Busca a lista atualizada
          await fetchColetores();
          return true;
        }
      } else {
        // Resposta não-JSON, mas a operação pode ter sido bem-sucedida
        console.log('Resposta não-JSON recebida, mas operação pode ter sido bem-sucedida');
        // Busca a lista atualizada
        await fetchColetores();
        return true;
      }
    } catch (error) {
      console.error('Erro ao atualizar coletor:', error);
      throw error;
    }
  };

  // Excluir um coletor
  const deleteColetor = async (id: number): Promise<boolean> => {
    try {
      console.log('Excluindo coletor ID:', id, 'usando DELETE na URL:', `${API_URL}/${id}`);
      
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: DEFAULT_HEADERS
      });
      
      console.log('Status da resposta:', response.status);
      
      if (!response.ok) {
        throw new Error(`Erro ao excluir coletor: ${response.status}`);
      }
      
      // Atualiza o estado removendo o coletor
      setColetores(prev => prev.filter(c => c.idColetor !== id));
      console.log('Coletor excluído com sucesso!');
      return true;
    } catch (error) {
      console.error('Erro ao excluir coletor:', error);
      throw error;
    }
  };

  // Carregar coletores na inicialização
  useEffect(() => {
    fetchColetores();
  }, [fetchColetores]);

  return {
    coletores,
    loading,
    error,
    fetchColetores,
    fetchColetorById,
    createColetor,
    updateColetor,
    deleteColetor
  };
}; 