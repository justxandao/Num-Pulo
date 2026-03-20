# Documentação de Arquitetura Inicial: Plataforma "Num Pulo"

## 1. Visão Geral da Arquitetura

A plataforma **Num Pulo** será iniciada utilizando o padrão **Monólito Modular** (Modular Monolith). Esta abordagem permite a simplicidade de desenvolvimento e deploy de um monólito nos estágios iniciais da startup, mantendo as fronteiras de domínio estritas. Isso garante que, quando for necessário escalar (transição para microserviços), a extração dos módulos seja feita de forma natural e com baixo acoplamento.

### Componentes de Alto Nível
- **API Central (Backend):** Responsável por consolidar todos os módulos de negócio (Catálogo, Pedidos, Usuários, etc.).
- **Aplicações Cliente (Frontend):**
  - **Web Client:** Marketplace para consumidores (React + Vite).
  - **Web Merchant:** Portal do Lojista para gestão de pedidos e cardápio (React + Vite).
  - **Web Admin:** Painel Administrativo Global para moderação de lojas e auditoria (React + Vite).
  - **Mobile Client:** App nativo para consumidores com tracking em tempo real (React Native + Expo).

---

## 2. Estrutura de Monorepo (Turbo)

```text
├── apps
│   ├── api             # Fastify + Prisma + Socket.io
│   ├── web-client      # Marketplace Consumidor
│   ├── web-merchant    # Gestão do Lojista
│   ├── web-admin       # Moderação Global (Aprovações/Bloqueios)
│   └── mobile-client   # App Nativo (Expo)
├── packages
│   ├── database        # Schema Prisma e Cliente compartilhado
│   └── ui (previsto)   # Componentes compartilhados
```

---

## 3. Moderação e Ciclo de Vida da Loja

Como medida de segurança e qualidade, a plataforma implementa um fluxo de aprovação:
1. **Cadastro**: O lojista cria a loja via `web-merchant`. O status inicial é `PENDING`.
2. **Moderação**: O Administrador visualiza a loja no `web-admin` e decide por **APROVAR** ou **BLOQUEAR**.
3. **Visibilidade**: Apenas lojas com status `APPROVED` e marcadas como `isOpen` aparecem no Marketplace (`web-client` e `mobile-client`).

---

## 4. Como Rodar o Projeto

1. Instale as dependências na raiz:
```bash
npm install
```

2. Configure as variáveis de ambiente (`.env`) na raiz e em `apps/api`.

3. Prepare o banco de dados:
```bash
npx turbo run db:push --filter=@num-pulo/database
```

4. Inicie todo o ecossistema (API + 4 Frontends):
```bash
npx turbo run dev
```

> [!IMPORTANT]
> Para testar o **Mobile Client**, certifique-se de ter o app **Expo Go** instalado no seu celular e estar na mesma rede Wi-Fi que o seu computador.
