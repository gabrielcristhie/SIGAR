# Interface Visual - Exemplos do Sistema de Roadmap

## 🖥️ Capturas de Tela Conceituais

### 1. Menu Lateral (Sidebar) - Usuário Admin
```
┌─────────────────────────────────┐
│ 👤 Logado como: Admin Sistema   │
├─────────────────────────────────┤
│ ➕ Incluir Área de Risco       │
│ 🗑️ Remover Área de Risco       │
├─────────────────────────────────┤
│ 🛡️ ÁREA ADMINISTRATIVA         │
│ 📋 Gerenciar Solicitações      │
│ 🗺️ Planejar Vistorias          │ ← NOVO!
├─────────────────────────────────┤
│ 🔍 ÁREA DE VISTORIA             │
│ 📍 Roadmap de Vistorias        │ ← NOVO!
└─────────────────────────────────┘
```

### 2. Menu Lateral (Sidebar) - Usuário Inspetor
```
┌─────────────────────────────────┐
│ 👤 Logado como: João Silva      │
├─────────────────────────────────┤
│ ➕ Incluir Área de Risco       │
│ 🗑️ Remover Área de Risco       │
├─────────────────────────────────┤
│ 🔍 ÁREA DE VISTORIA             │
│ 📍 Roadmap de Vistorias        │ ← DISPONÍVEL
└─────────────────────────────────┘
```

### 3. Modal de Roadmap - Aba "Roadmaps"
```
┌─────────────────────────────────────────────────────────────────┐
│                    📋 Sistema de Roadmap de Vistorias           │
├─────────────────────────────────────────────────────────────────┤
│ [Roadmaps] [Nova Vistoria] [Registrar Inspeção]               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ 📊 ESTATÍSTICAS GERAIS                                         │
│ • Total de Roadmaps: 2                                         │
│ • Roadmaps Ativos: 1                                           │
│ • Áreas para Visitar: 4                                        │
│ • Inspeções Concluídas: 1                                      │
│                                                                 │
│ 🗂️ ROADMAPS ATIVOS                                             │
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ 🚨 Vistoria Região Norte - Janeiro 2025                    │ │
│ │ Prioridade: ALTA | Progresso: 33% (1/3)                    │ │
│ │ Inspetor: João Silva | Criado: 15/01/2025                  │ │
│ │                                                             │ │
│ │ Áreas:                                                      │ │
│ │ ✅ Encosta do Morro da Cruz (Concluída)                   │ │
│ │ 🔄 Vale do Jardim Petrópolis (Em Andamento)               │ │
│ │ ⏳ Córrego do Bacalhau (Pendente)                          │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ 📋 Monitoramento Áreas Críticas - Região Sul               │ │
│ │ Prioridade: MÉDIA | Progresso: 0% (0/2)                    │ │
│ │ Inspetor: Maria Santos | Criado: 18/01/2025                │ │
│ │                                                             │ │
│ │ Áreas:                                                      │ │
│ │ ⏳ Setor Vila Nova (Pendente)                               │ │
│ │ ⏳ Margem do Rio Meia Ponte (Pendente)                      │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│                                      [Fechar]                  │
└─────────────────────────────────────────────────────────────────┘
```

### 4. Modal de Roadmap - Aba "Nova Vistoria"
```
┌─────────────────────────────────────────────────────────────────┐
│                    📋 Sistema de Roadmap de Vistorias           │
├─────────────────────────────────────────────────────────────────┤
│ [Roadmaps] [Nova Vistoria] [Registrar Inspeção]               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ 🆕 CRIAR NOVO ROADMAP                                           │
│                                                                 │
│ Título: [________________________________]                     │
│                                                                 │
│ Descrição:                                                      │
│ ┌─────────────────────────────────────────┐                     │
│ │                                         │                     │
│ │                                         │                     │
│ │                                         │                     │
│ └─────────────────────────────────────────┘                     │
│                                                                 │
│ Inspetor: [__________________________]                          │
│                                                                 │
│ Prioridade: [ALTA ▼] Estimativa: [_3_] dias                    │
│                                                                 │
│ 📍 SELEÇÃO DE ÁREAS                                            │
│                                                                 │
│ ☐ R1-GO-001 - Encosta do Morro da Cruz                        │
│ ☑ R1-GO-002 - Vale do Jardim Petrópolis                       │
│ ☑ R1-GO-003 - Córrego do Bacalhau                             │
│ ☐ R1-GO-004 - Setor Vila Nova                                 │
│ ☑ R1-GO-005 - Margem do Rio Meia Ponte                        │
│                                                                 │
│ Áreas selecionadas: 3                                          │
│                                                                 │
│                     [Cancelar] [Criar Roadmap]                 │
└─────────────────────────────────────────────────────────────────┘
```

### 5. Modal de Roadmap - Aba "Registrar Inspeção"
```
┌─────────────────────────────────────────────────────────────────┐
│                    📋 Sistema de Roadmap de Vistorias           │
├─────────────────────────────────────────────────────────────────┤
│ [Roadmaps] [Nova Vistoria] [Registrar Inspeção]               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ 📝 REGISTRAR INSPEÇÃO                                          │
│                                                                 │
│ Roadmap: [Vistoria Região Norte - Janeiro 2025 ▼]             │
│                                                                 │
│ Área: [Vale do Jardim Petrópolis ▼]                           │
│                                                                 │
│ Status: [CONCLUÍDA ▼]                                          │
│                                                                 │
│ Achados da Inspeção:                                           │
│ ┌─────────────────────────────────────────┐                     │
│ │ Observado movimento de solo na encosta  │                     │
│ │ próxima às residências 15-23. Presença │                     │
│ │ de trincas no pavimento da rua         │                     │
│ │ principal. Dois imóveis apresentam     │                     │
│ │ rachaduras nas paredes voltadas para   │                     │
│ │ a encosta.                             │                     │
│ └─────────────────────────────────────────┘                     │
│                                                                 │
│ Recomendações:                                                  │
│ ┌─────────────────────────────────────────┐                     │
│ │ Monitoramento semanal do movimento do  │                     │
│ │ solo. Instalação de marcos             │                     │
│ │ topográficos. Orientação aos moradores │                     │
│ │ sobre sinais de perigo.                │                     │
│ └─────────────────────────────────────────┘                     │
│                                                                 │
│ Nível de Risco: [MÉDIO ▼]                                      │
│                                                                 │
│ Inspetor: [João Silva_________________]                         │
│                                                                 │
│                     [Cancelar] [Registrar Inspeção]            │
└─────────────────────────────────────────────────────────────────┘
```

## 🎨 Códigos de Cores e Ícones

### Status das Áreas
- ✅ **Verde** - Concluída
- 🔄 **Amarelo** - Em Andamento  
- ⏳ **Cinza** - Pendente
- ❌ **Vermelho** - Cancelada

### Níveis de Prioridade
- 🚨 **ALTA** - Vermelho/Urgente
- ⚠️ **MÉDIA** - Amarelo/Importante  
- 📋 **BAIXA** - Verde/Normal

### Ícones do Sistema
- 🗺️ **Planejar** - Área administrativa
- 📍 **Executar** - Área de campo
- 📋 **Acompanhar** - Visualização de dados
- 📝 **Registrar** - Documentação
- 📊 **Métricas** - Estatísticas

## 🔄 Fluxo de Navegação

```
Login Admin/Inspetor
    │
    ▼
Sidebar → "Roadmap de Vistorias"
    │
    ▼
Modal com 3 Abas:
    │
    ├── Roadmaps (Visualizar existentes)
    │   └── Lista com progresso e detalhes
    │
    ├── Nova Vistoria (Criar planejamento)
    │   └── Formulário + Seleção de áreas
    │
    └── Registrar Inspeção (Documentar campo)
        └── Formulário de achados e recomendações
```

## 💻 Responsividade

### Desktop (>1024px)
- Modal em tela cheia com 3 colunas
- Visualização completa de todos os dados
- Formulários lado a lado

### Tablet (768px-1024px)  
- Modal adaptado com 2 colunas
- Abas empilhadas conforme necessário
- Texto reduzido mas legível

### Mobile (<768px)
- Modal em tela cheia
- Uma coluna única
- Abas em formato carrossel
- Formulários simplificados

Estes exemplos visuais mostram como o sistema ficará acessível e intuitivo para os usuários, mantendo todas as funcionalidades organizadas de forma clara e eficiente! 🎯
