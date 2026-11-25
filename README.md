# EzShop - Lista de Compras Inteligente

Uma aplicação web moderna para gerenciamento de listas de compras, desenvolvida com Next.js 14 e TypeScript. O EzShop oferece uma experiência completa para organizar suas compras, controlar gastos e acompanhar estatísticas de consumo.

## 🎯 Missão

Simplificar o processo de planejamento e execução de compras, oferecendo uma ferramenta intuitiva que permite aos usuários:
- Organizar produtos por categorias
- Controlar orçamento e gastos
- Acompanhar histórico de compras
- Visualizar estatísticas de consumo
- Exportar relatórios detalhados

## 🚀 Funcionalidades

- **📝 Gerenciamento de Listas**: Crie e gerencie múltiplas listas de compras
- **🏷️ Categorização Inteligente**: Organize produtos em 10 categorias (Mercearia, Limpeza, Frios, Carnes, Padaria, Higiene, Bebidas, Congelados, Hortifruti, Outros)
- **💰 Controle Financeiro**: Defina limites de gastos e acompanhe o total em tempo real
- **✅ Sistema de Check**: Marque produtos como adquiridos com atualização instantânea
- **📊 Estatísticas**: Visualize gráficos de gastos mensais e anuais
- **📋 Histórico**: Acesse compras anteriores com filtros por data
- **📄 Exportação PDF**: Gere relatórios detalhados das suas compras
- **🌙 Temas**: Interface adaptável com modo claro e escuro
- **🔍 Busca Avançada**: Encontre produtos rapidamente com filtros por categoria
- **📱 Responsivo**: Funciona perfeitamente em desktop e mobile

## 🛠️ Stack Tecnológica

### Frontend
- **Next.js 14.2.5** - Framework React com App Router
- **React 18** - Biblioteca de interface
- **TypeScript 5** - Tipagem estática
- **Tailwind CSS 3.4.1** - Framework CSS utilitário

### UI/UX
- **Shadcn UI** - Sistema de componentes
- **Radix UI** - Componentes primitivos acessíveis
- **Lucide React** - Biblioteca de ícones
- **Lottie React** - Animações interativas

### Estado e Dados
- **TanStack React Query 5.87.1** - Gerenciamento de estado servidor
- **Zustand 5.0.5** - Estado global da aplicação
- **React Hook Form 7.60.0** - Gerenciamento de formulários
- **Zod 3.25.76** - Validação de schemas

### Backend e Autenticação
- **Firebase 12.1.0** - Autenticação e banco de dados Firestore
- **Firebase Admin SDK** - Autenticação server-side e MCP
- **MCP SDK** - Model Context Protocol para integração com agentes AI

### Utilitários
- **Sonner 2.0.6** - Sistema de notificações
- **Recharts 2.15.1** - Gráficos e visualizações
- **next-themes 0.4.6** - Gerenciamento de temas

## 🤖 Integração MCP (Model Context Protocol)

O EzShop oferece integração completa com agentes AI através do Model Context Protocol (MCP), permitindo que assistentes inteligentes gerenciem suas listas de compras.

### Autenticação

A integração usa **Personal Access Tokens (PATs)** para autenticação:
- Tokens gerados pelo usuário na interface de configurações
- Validade de 30 dias
- Máximo de 3 tokens ativos por usuário
- Tokens são exibidos apenas uma vez na criação
- Stored apenas como hash SHA-256 no Firestore

### Configuração do Servidor MCP

**Endpoint:** `https://seu-dominio.vercel.app/api/mcp`

**Autenticação:** Bearer token no header `Authorization`

```bash
Authorization: Bearer seu_token_aqui
```

### Variáveis de Ambiente Necessárias

Configure as seguintes variáveis no Vercel:

```bash
# Firebase Admin SDK (obrigatórias para MCP)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your_project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

> **Importante:** A `FIREBASE_PRIVATE_KEY` deve estar em uma linha, com `\n` como separador de linhas.

### Ferramentas MCP Disponíveis

O servidor MCP oferece as seguintes ferramentas para gerenciamento de listas:

#### Consulta
- `list_active_lists` - Lista listas ativas (próprias + compartilhadas)
- `list_history` - Lista histórico de compras finalizadas
- `get_list` - Obtém detalhes de uma lista específica

#### Gerenciamento de Listas
- `create_list` - Cria nova lista
- `update_list` - Atualiza título/valor máximo
- `finish_purchase` - Finaliza compra (calcula total)
- `delete_history_purchase` - Deleta do histórico (apenas owner)

#### Gerenciamento de Itens
- `add_items` - Adiciona itens em batch
- `update_item` - Atualiza item existente
- `remove_item` - Remove item
- `check_item` - Marca como comprado
- `uncheck_item` - Desmarca como comprado

#### Compartilhamento
- `share_list` - Compartilha com usuários (por username)
- `unshare_list` - Remove usuários do compartilhamento

### Regras de Acesso

- **Owner (user_id)**: Pode ler, editar, deletar, compartilhar e remover compartilhamento
- **Shared Users (shared_with)**: Podem ler e editar itens, mas não podem deletar a lista ou modificar compartilhamento
- Todas as operações respeitam as mesmas regras do Firestore Security Rules

### Notificações

Quando uma lista é compartilhada via MCP, o sistema cria automaticamente notificações para os usuários adicionados, mantendo consistência com o comportamento da aplicação web.

### Gerenciamento de Tokens

#### Criar Token
```bash
POST /api/agent-tokens
Authorization: Bearer <firebase_id_token>
Content-Type: application/json

{
  "label": "Meu Agente Grok"
}
```

#### Listar Tokens
```bash
GET /api/agent-tokens
Authorization: Bearer <firebase_id_token>
```

#### Revogar Token
```bash
DELETE /api/agent-tokens
Authorization: Bearer <firebase_id_token>
Content-Type: application/json

{
  "token_hash": "sha256_hash_do_token"
}
```


