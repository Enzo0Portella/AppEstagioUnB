# Changelog - Reestruturação da API de Insetos

## [1.0.0] - Data da Refatoração

### Adicionado
- Criado arquivo `api.ts` com funções dedicadas para operações CRUD de insetos
- Adicionado arquivo `api-config.ts` com configurações centralizadas da API
- Criado arquivo `insect-utils.ts` com funções utilitárias para manipulação de insetos
- Implementado hook personalizado `useInsects` para gerenciar o estado e operações de API
- Adicionada documentação completa com `README-API.md`
- Criado sistema de tratamento de erros unificado para todas as chamadas de API
- Adicionado `CHANGELOG.md` para documentar as alterações

### Alterado
- Refatorados componentes para usar o novo hook `useInsects` em vez de fazer chamadas diretas à API
- Atualizado `CardInsect` para receber um objeto inseto completo
- Modificado `InsectList` para usar a propriedade `items` em vez de `insects`
- Atualizado `NavActions` para usar a nova estrutura de API
- Melhorado o tratamento de erros em todas as operações de API
- Padronizada a conversão de dados entre o formulário e a API

### Removido
- Eliminadas chamadas de API duplicadas em vários componentes
- Removida lógica de negócio dos componentes UI

### Correções
- Corrigidos problemas de tipagem em todos os componentes
- Melhorado o tratamento da data de coleta para garantir formato consistente

### Melhorias Técnicas
- Implementada tipagem forte em todo o sistema de API
- Adicionada documentação em código com JSDoc
- Centralizado o gerenciamento de estado da aplicação
- Melhorada a modularização e a separação de responsabilidades
- Facilitada a manutenção e expansão futura da API 