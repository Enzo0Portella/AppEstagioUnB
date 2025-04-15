import { useState, useCallback } from 'react';
import { Insect, InsectFormData } from '@/types/insect';
import { 
  fetchAllInsects, 
  fetchInsectById, 
  createInsect, 
  updateInsect,
  deleteInsect 
} from '@/lib/api';
import { formDataToApiInsect } from '@/lib/insect-utils';

interface UseInsectsResult {
  insects: Insect[];
  isLoading: boolean;
  error: string | null;
  selectedInsect: Insect | null;
  setSelectedInsect: (insect: Insect | null) => void;
  fetchInsects: () => Promise<void>;
  getInsect: (id: number) => Promise<Insect | null>;
  addInsect: (formData: InsectFormData) => Promise<Insect | null>;
  editInsect: (formData: InsectFormData) => Promise<Insect | null>;
  removeInsect: (id: number) => Promise<boolean>;
}

export const useInsects = (): UseInsectsResult => {
  const [insects, setInsects] = useState<Insect[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedInsect, setSelectedInsect] = useState<Insect | null>(null);

  // Buscar todos os insetos
  const fetchInsects = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetchAllInsects();
      
      if (response.error) {
        setError(response.error);
      } else if (response.data) {
        setInsects(response.data);
      }
    } catch (err) {
      setError('Erro ao buscar insetos');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Buscar um inseto por ID
  const getInsect = useCallback(async (id: number): Promise<Insect | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetchInsectById(id);
      
      if (response.error) {
        setError(response.error);
        return null;
      }
      
      return response.data;
    } catch (err) {
      setError('Erro ao buscar inseto');
      console.error(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Adicionar um novo inseto
  const addInsect = useCallback(async (formData: InsectFormData): Promise<Insect | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (!formData.dataColeta) {
        setError('Data de coleta é obrigatória');
        return null;
      }

      // Usa a função utilitária para converter os dados
      const insectData = formDataToApiInsect(formData) as Omit<Insect, 'id'>;
      const response = await createInsect(insectData);
      
      if (response.error) {
        setError(response.error);
        return null;
      }
      
      if (response.data) {
        // Atualiza a lista de insetos após adicionar um novo
        await fetchInsects();
      }
      
      return response.data;
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Erro ao adicionar inseto');
      }
      console.error(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [fetchInsects]);

  // Editar um inseto existente
  const editInsect = useCallback(async (formData: InsectFormData): Promise<Insect | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (!formData.id) {
        setError('ID do inseto é obrigatório para edição');
        return null;
      }

      // Usa a função utilitária para converter os dados
      const insectData = formDataToApiInsect(formData) as Insect;
      const response = await updateInsect(insectData);
      
      if (response.error) {
        setError(response.error);
        return null;
      }
      
      if (response.data) {
        // Atualiza a lista de insetos após editar
        await fetchInsects();
      }
      
      return response.data;
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Erro ao editar inseto');
      }
      console.error(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [fetchInsects]);

  // Remover um inseto
  const removeInsect = useCallback(async (id: number): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await deleteInsect(id);
      
      if (response.error) {
        setError(response.error);
        return false;
      }
      
      // Atualiza a lista de insetos após remover
      await fetchInsects();
      
      return true;
    } catch (err) {
      setError('Erro ao remover inseto');
      console.error(err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [fetchInsects]);

  return {
    insects,
    isLoading,
    error,
    selectedInsect,
    setSelectedInsect,
    fetchInsects,
    getInsect,
    addInsect,
    editInsect,
    removeInsect
  };
}; 