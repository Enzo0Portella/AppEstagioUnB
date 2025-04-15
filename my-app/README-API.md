# Documentação da API de Insetos

Este documento descreve a estrutura da API para gerenciamento de insetos na aplicação.

## Estrutura de Arquivos

A estrutura da API foi organizada da seguinte forma:

```
src/
├── lib/
│   ├── api.ts            # Funções principais da API
│   ├── api-config.ts     # Configurações centralizadas
│   └── insect-utils.ts   # Utilitários para manipulação de insetos
│
├── hooks/
│   └── useInsects.ts     # Hook personalizado para uso da API
│
└── types/
    └── insect.ts         # Definições de tipos
```

## Tipos de Dados

A entidade principal é o `Insect`, definida em `types/insect.ts`:

```typescript
interface Insect {
  id: number;
  nome: string;
  localColeta: string;
  dataColeta: string;      // Formato ISO: YYYY-MM-DD
  nomeColetor: string;
  tag: string;
  familia: string;
  genero: string;
  ordem: string;
}
```

Para formulários, usamos `InsectFormData` que é semelhante, mas com `dataColeta` como um objeto `Date`.

## Configurações da API

O arquivo `api-config.ts` centraliza as configurações:

- `API_BASE_URL`: URL base da API
- `API_ENDPOINTS`: Endpoints específicos
- `DEFAULT_HEADERS`: Headers padrão para requisições
- `API_TIMEOUT`: Timeout padrão (10 segundos)
- `MAX_RETRIES`: Número máximo de tentativas

## Funções da API

Em `api.ts`, implementamos as seguintes funções:

- `fetchAllInsects()`: Busca todos os insetos
- `fetchInsectById(id)`: Busca um inseto específico
- `createInsect(insect)`: Cria um novo inseto
- `updateInsect(insect)`: Atualiza um inseto existente
- `deleteInsect(id)`: Remove um inseto

Todas as funções retornam um objeto `ApiResponse<T>` que contém:
- `data`: Os dados retornados (ou null em caso de erro)
- `error`: Mensagem de erro (ou null se sucesso)

## Hook useInsects

O hook `useInsects` fornece uma interface fácil para componentes React:

```typescript
const {
  insects,              // Lista de insetos
  isLoading,            // Estado de carregamento
  error,                // Mensagem de erro
  selectedInsect,       // Inseto selecionado
  setSelectedInsect,    // Atualiza o inseto selecionado
  fetchInsects,         // Busca todos os insetos
  getInsect,            // Busca um inseto por ID
  addInsect,            // Adiciona um novo inseto
  editInsect,           // Edita um inseto
  removeInsect          // Remove um inseto
} = useInsects();
```

## Utilitários

O arquivo `insect-utils.ts` contém funções auxiliares:

- `formDataToApiInsect()`: Converte de InsectFormData para o formato da API
- `apiInsectToFormData()`: Converte do formato da API para InsectFormData
- `filterInsectsByTerm()`: Filtra insetos por termo de busca
- `getInsectStats()`: Obtém estatísticas dos insetos

## Exemplo de Uso

```typescript
import { useInsects } from '@/hooks/useInsects';

function MyComponent() {
  const { insects, isLoading, error, fetchInsects } = useInsects();
  
  useEffect(() => {
    fetchInsects();
  }, [fetchInsects]);
  
  if (isLoading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;
  
  return (
    <div>
      <h1>Total de insetos: {insects.length}</h1>
      <ul>
        {insects.map(insect => (
          <li key={insect.id}>{insect.nome}</li>
        ))}
      </ul>
    </div>
  );
}
```

## Comunicação com o Backend

A API se comunica com um backend na porta 8080 através do endpoint `/api/insetos`.

Para adicionar novas funcionalidades, expanda os endpoints em `api-config.ts` e adicione novas funções em `api.ts`. 