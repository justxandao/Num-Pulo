# TASK-004 - Validação de Schemas DTO na API
Status: Concluído

## Alterações Realizadas:
1. Instalação e Configuração:
   - `@sinclair/typebox` e `@fastify/type-provider-typebox` instalados.
   - `server.ts` atualizado para usar o provedor de tipos.

2. Schemas Implementados:
   - `auth.schema.ts`: Registro (Login/Register).
   - `store.schema.ts`: Criação e Atualização de Lojas.
   - `product.schema.ts`: Criação e Atualização de Produtos.
   - `order.schema.ts`: Criação e Atualização de Status de Pedidos.

3. Integração nos Módulos:
   - Rotas atualizadas com a propriedade `schema`.
   - Controllers tipados usando `Static<typeof Schema>`.

## Verificação:
- Compilação realizada com sucesso (`npm run build`).
- Contratos de dados agora são validados em tempo de execução pelo Fastify.
