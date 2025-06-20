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

## 🚀 Como Executar

### Método Rápido (Script de Demonstração)
```bash
# Clone o repositório
git clone [url-do-repositorio]
cd sigar-go-app

# Execute o comando
npm run dev
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

## 🤝 Contribuição

1. Faça fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request