# Sistema de Roadmap de Vistorias - SIGAR-GO

## Funcionalidade de Planejamento de Vistorias

O sistema SIGAR-GO agora inclui um módulo completo para **planejamento e execução de vistorias** em áreas de risco, permitindo que servidores da Defesa Civil organizem suas atividades de campo de forma estruturada e eficiente.

### Acesso ao Sistema

#### Usuários Autorizados
- **Administradores (admin)**: Acesso completo a todas as funcionalidades
- **Inspetores (inspector)**: Acesso ao roadmap de vistorias para planejamento e execução

#### Como Acessar
1. Faça login no sistema usando uma das credenciais:
   - `admin` / senha qualquer - Para administradores
   - `inspetor` / senha qualquer - Para inspetores de campo
   - `demo` / senha qualquer - Para demonstração

2. No menu lateral (Sidebar), você encontrará:
   - **Área Administrativa** (apenas admin): "Planejar Vistorias"
   - **Área de Vistoria** (admin e inspector): "Roadmap de Vistorias"

### Funcionalidades Principais

#### 1. Criação de Roadmaps
- **Título**: Nome identificativo do roadmap
- **Descrição**: Detalhes sobre o objetivo das vistorias
- **Inspetor Responsável**: Quem executará as vistorias
- **Prioridade**: ALTA, MÉDIA ou BAIXA
- **Estimativa de Dias**: Tempo previsto para conclusão
- **Seleção de Áreas**: Escolha das áreas de risco a serem visitadas

#### 2. Gestão de Vistorias
- **Acompanhamento**: Status de cada área (Pendente, Concluída, Em Andamento)
- **Registro de Resultados**: Formulário para documentar achados
- **Recomendações**: Sugestões de melhorias ou ações
- **Atualização de Risco**: Revisão do nível de risco após vistoria

#### 3. Estatísticas e Controle
- **Dashboard**: Visão geral dos roadmaps ativos
- **Métricas**: Áreas visitadas, pendentes, concluídas
- **Histórico**: Registro completo de todas as vistorias realizadas

### Interface do Sistema

#### Abas Principais
1. **Roadmaps**: Lista todos os roadmaps criados com status e progresso
2. **Nova Vistoria**: Criação de novos planos de vistoria
3. **Registrar Inspeção**: Formulário para documentar resultados das visitas

#### Campos do Formulário de Vistoria
- **Roadmap**: Seleção do plano de vistoria
- **Área**: Escolha da área específica sendo inspecionada  
- **Status**: Concluída, Em Andamento, Cancelada
- **Achados**: Descrição detalhada das observações
- **Recomendações**: Sugestões de ações ou melhorias
- **Nível de Risco**: Reavaliação após a vistoria
- **Inspetor**: Responsável pela vistoria

### Benefícios do Sistema

#### Para Gestores
- **Planejamento Estratégico**: Organização eficiente das vistorias
- **Controle de Qualidade**: Acompanhamento do trabalho de campo
- **Relatórios**: Dados para tomada de decisões

#### Para Inspetores
- **Organização**: Roteiro claro das áreas a visitar
- **Produtividade**: Otimização do tempo e recursos
- **Documentação**: Registro padronizado dos achados

#### Para o Sistema
- **Rastreabilidade**: Histórico completo das atividades
- **Atualização Dinâmica**: Informações sempre atualizadas
- **Integração**: Conectado com o sistema de áreas de risco

### Fluxo de Trabalho Típico

1. **Planejamento**
   - Administrador cria roadmap com áreas prioritárias
   - Define inspetor responsável e cronograma

2. **Execução**
   - Inspetor acessa o roadmap no campo
   - Visita as áreas conforme planejado
   - Registra achados e observações

3. **Documentação**
   - Preenche formulário de inspeção
   - Atualiza status das áreas
   - Adiciona recomendações

4. **Acompanhamento**
   - Gestor monitora progresso
   - Analisa resultados e métricas
   - Planeja próximas ações

### Persistência de Dados

Todos os dados do sistema de roadmap são salvos automaticamente no navegador (localStorage), garantindo que:
- Roadmaps criados sejam preservados entre sessões
- Inspeções registradas não sejam perdidas
- Histórico completo seja mantido

### Integração com Outras Funcionalidades

O sistema de roadmap está integrado com:
- **Áreas de Risco**: Seleção automática das áreas cadastradas
- **Sistema de Usuários**: Controle de acesso por perfil
- **Notificações**: Alertas sobre atividades importantes
- **Relatórios**: Dados para análises gerenciais

Este sistema representa um avanço significativo na organização e eficiência das atividades de vistoria da Defesa Civil, proporcionando maior controle e qualidade no monitoramento das áreas de risco.
