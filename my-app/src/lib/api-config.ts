/**
 * Configurações centralizadas da API
 */

// URL base da API
export const API_BASE_URL = 'http://localhost:8080';

// Endpoints específicos
export const API_ENDPOINTS = {
  INSECTS: `${API_BASE_URL}/api/insetos`,
  COLLECTORS: `${API_BASE_URL}/api/coletor`
};

// Headers padrão para requisições
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};

// Constantes para timeout e retry
export const API_TIMEOUT = 10000; // 10 segundos
export const MAX_RETRIES = 3; 