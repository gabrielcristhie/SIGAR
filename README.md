# SIGAR-GO - Sistema de Informações Geográficas de Áreas de Risco de Goiás

Este é o frontend do sistema SIGAR-GO desenvolvido em React, seguindo o plano de execução passo a passo para criar uma aplicação moderna e responsiva para monitoramento de áreas de risco.

## 🚀 Tecnologias Utilizadas

- **React 19** - Framework principal
- **Vite** - Build tool e servidor de desenvolvimento
- **Tailwind CSS** - Framework de estilização
- **React-Leaflet + Leaflet** - Biblioteca de mapas interativos
- **Zustand** - Gerenciamento de estado global
- **Axios** - Cliente HTTP para chamadas de API

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── Header.jsx      # Cabeçalho da aplicação
│   ├── Sidebar.jsx     # Barra lateral com ações
│   ├── MapComponent.jsx # Componente do mapa
│   ├── InfoPanel.jsx   # Painel de informações das áreas
│   ├── LoginModal.jsx  # Modal de login
│   ├── Layout.jsx      # Layout principal
│   ├── LoadingOverlay.jsx # Overlay de carregamento
│   └── Notification.jsx   # Componente de notificações
├── stores/
│   └── useAppStore.js  # Store Zustand para estado global
├── services/
│   └── api.js         # Configuração do Axios e serviços de API
├── data/
│   └── mockData.js    # Dados mockados para desenvolvimento
└── hooks/             # Hooks personalizados (futuro)
```

## ⚡ Funcionalidades Implementadas

### ✅ Interface de Usuário
- Layout responsivo com header, sidebar e área principal
- Mapa interativo com visualização de áreas de risco
- Painel de informações detalhadas das áreas
- Modal de login funcional
- Indicadores de carregamento e notificações de erro

### ✅ Gerenciamento de Estado
- Store Zustand configurado com persistência
- Estados para áreas de risco, interface e autenticação
- Ações para manipulação de dados e interface

### ✅ Sistema de Autenticação
- Modal de login com validação
- Simulação de autenticação (fallback quando API não disponível)
- Persistência do estado de login
- Interface diferenciada para usuários logados
- Funcionalidade de logout

### ✅ Integração com API
- Configuração do Axios com interceptors
- Fallback para dados mockados quando API não disponível
- Tratamento de erros e estados de carregamento
- Suporte a variáveis de ambiente

## 🚀 Como Executar

### Método Rápido (Script de Demonstração)
```bash
# Clone o repositório
git clone [url-do-repositorio]
cd sigar-go-app

# Execute o script de demonstração
./demo.sh
```

### Método Manual
```bash
# Clone o repositório
git clone [url-do-repositorio]
cd sigar-go-app

# Instale as dependências
npm install

# Execute o projeto em modo de desenvolvimento
npm run dev
```

O projeto estará disponível em `http://localhost:5173` (ou outra porta se esta estiver ocupada).

### Build para Produção
```bash
npm run build
npm run preview
```

## 🧪 Como Testar

Para um guia completo de testes, consulte o arquivo [`GUIA_TESTE.md`](./GUIA_TESTE.md).

### Teste Rápido
1. **Visualização**: Clique em qualquer círculo colorido no mapa
2. **Login**: Clique em "Incluir Área de Risco" e use qualquer usuário/senha
3. **Responsividade**: Redimensione a janela do navegador

### ⚠️ Resolução de Problemas

#### Modal de Login "Travado"
Se ao clicar em "Incluir Área de Risco" a tela ficar escura sem mostrar o modal:
- Pressione a tecla `Esc`
- Clique fora da área escura
- Recarregue a página se necessário

#### Console com Erros
É normal ver no console do navegador:
```
API não disponível, usando dados mockados: Network Error
Failed to load resource: net::ERR_CONNECTION_REFUSED
```
Isso indica que o sistema está funcionando corretamente com dados mockados (não há backend conectado).

## 🔧 Configuração

### Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto:

```env
# Configurações do Backend
VITE_API_URL=http://localhost:3001/api

# Configurações de Debug
VITE_DEBUG_MODE=true

# Configurações do Mapa
VITE_MAP_DEFAULT_CENTER_LAT=-15.9339
VITE_MAP_DEFAULT_CENTER_LNG=-49.8333
VITE_MAP_DEFAULT_ZOOM=7
```

## 🗺️ Como Usar

### Visualização do Mapa
1. O mapa carrega automaticamente com as áreas de risco
2. Clique em qualquer círculo colorido para ver detalhes da área
3. Use o painel lateral direito para navegar pelas informações

### Sistema de Login
1. Clique em qualquer ação na sidebar (Incluir, Alterar, Remover)
2. Insira qualquer usuário/senha para simular o login
3. Após autenticado, as funcionalidades ficam disponíveis

### Recursos Implementados
- ✅ Visualização interativa de áreas de risco no mapa
- ✅ Painel de informações detalhadas
- ✅ Sistema de autenticação simulado
- ✅ Interface responsiva
- ✅ Estados de carregamento e erro
- ✅ Persistência do estado de login

### Próximas Implementações
- 🔄 Integração com backend real
- 🔄 CRUD completo de áreas de risco
- 🔄 Sistema de notificações em tempo real
- 🔄 Filtros e busca avançada
- 🔄 Relatórios e exportação de dados

## 🎨 Personalização

O projeto utiliza Tailwind CSS para estilização. Para personalizar:

1. Edite `tailwind.config.js` para modificar o tema
2. Adicione classes personalizadas em `src/index.css`
3. Modifique os componentes em `src/components/`

## 📝 Status do Projeto

Este projeto implementa completamente as **Etapas 1-4** do plano de execução:

- ✅ **Etapa 1**: Configuração inicial do projeto
- ✅ **Etapa 2**: Interface estática construída
- ✅ **Etapa 3**: Mapa interativo implementado
- ✅ **Etapa 4**: Estado global e interatividade conectados
- 🔄 **Etapa 5**: Integração com backend (parcialmente implementada)

## 🤝 Contribuição

1. Faça fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request