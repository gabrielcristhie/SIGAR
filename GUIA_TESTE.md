# Guia de Teste - SIGAR-GO

## 🧪 Como Testar o Sistema

Este documento explica como testar todas as funcionalidades do sistema SIGAR-GO.

### 📱 Interface Principal

1. **Visualização do Mapa**
   - O mapa deve carregar automaticamente mostrando o estado de Goiás
   - Círculos coloridos representam as áreas de risco:
     - 🔴 Vermelho: Alto risco
     - 🟠 Laranja: Médio risco  
     - 🟡 Amarelo: Baixo risco

2. **Interação com Áreas de Risco**
   - Clique em qualquer círculo no mapa
   - O painel de informações deve abrir do lado direito
   - Verifique se as informações da área são exibidas corretamente

### 🔐 Sistema de Autenticação

1. **Testando o Login**
   - Clique em qualquer botão na sidebar esquerda (Incluir, Alterar, Remover)
   - Um modal de login deve aparecer
   - Digite qualquer usuário e senha (ex: `admin` / `123456`)
   - Clique em "Entrar"
   - O sistema deve simular o login e fechar o modal

2. **Estado Logado**
   - Após o login, o cabeçalho deve mostrar informações do usuário
   - A sidebar deve mostrar "Logado como: [nome do usuário]"
   - Os botões na sidebar não devem mais mostrar o ícone de cadeado

3. **Logout**
   - Clique no ícone de sair (🚪) no cabeçalho
   - O sistema deve fazer logout e voltar ao estado inicial

### 🎛️ Funcionalidades da Interface

1. **Sidebar (Menu Lateral)**
   - Em telas grandes: sempre visível
   - Em telas pequenas: usar o botão ☰ para abrir/fechar
   - Verificar responsividade

2. **Painel de Informações**
   - Abrir: clique em uma área de risco no mapa
   - Fechar: clique no ✕ no canto superior direito
   - Scroll: verificar se o conteúdo rola quando há muito texto

3. **Estados de Loading**
   - Ao fazer login: botão deve mostrar spinner
   - Overlay de carregamento pode aparecer em operações

### 🐛 Comportamentos Esperados

#### ✅ Funcionamento Normal

- **Console no Navegador**: É normal ver mensagens sobre "backend não conectado"
- **Dados Mockados**: O sistema usa dados falsos para demonstração
- **Login Simulado**: Qualquer usuário/senha é aceita em modo de desenvolvimento

#### ❌ Problemas Conhecidos

- **Modal Travado**: Se o modal de login "travar" com tela escura:
  - Pressione Esc ou clique fora do modal
  - Recarregue a página se necessário
  
- **Mapa Não Carrega**: 
  - Verifique conexão com internet (usa OpenStreetMap)
  - Recarregue a página

### 🔧 Modo Desenvolvedor

#### Variáveis de Ambiente
```env
VITE_DEBUG_MODE=true          # Habilita logs de debug
VITE_API_URL=http://localhost:3001/api  # URL da API (quando disponível)
```

#### Comandos Úteis
```bash
# Iniciar desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview
```

### 📊 Dados de Teste

O sistema inclui áreas de risco mockadas para:
- **Goiânia**: Encosta do Morro da Cruz
- **Anápolis**: Área Residencial Alto da Boa Vista  
- **Aparecida de Goiânia**: Setor Independência Mansões
- E outras...

### 🎯 Cenários de Teste Específicos

#### Teste 1: Fluxo Completo de Visualização
1. Abrir aplicação
2. Aguardar carregamento do mapa
3. Clicar em área vermelha (alto risco)
4. Verificar painel de informações
5. Fechar painel
6. Repetir com área de médio/baixo risco

#### Teste 2: Fluxo de Autenticação
1. Clicar em "Incluir Área de Risco"
2. Digitar credenciais no modal
3. Fazer login
4. Verificar mudanças na interface
5. Fazer logout
6. Verificar volta ao estado inicial

#### Teste 3: Responsividade
1. Testar em desktop (>1024px)
2. Testar em tablet (768-1024px)
3. Testar em mobile (<768px)
4. Verificar funcionamento do menu hambúrguer

### 🚀 Próximos Passos

Para produção, será necessário:
- Conectar com backend real
- Implementar CRUD real de áreas de risco
- Adicionar autenticação JWT real
- Implementar sistema de notificações
- Adicionar filtros e busca avançada

---

**💡 Dica**: Use as ferramentas de desenvolvedor do navegador (F12) para inspecionar elementos e verificar o console para mensagens de debug.
