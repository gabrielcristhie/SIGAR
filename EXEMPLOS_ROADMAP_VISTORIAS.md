# Exemplos Práticos - Sistema de Roadmap de Vistorias SIGAR-GO

## Dados de Exemplo Pré-carregados

O sistema vem com exemplos reais para demonstração das funcionalidades:

### 🎯 Roadmap 1: "Vistoria Região Norte - Janeiro 2025"
**Cenário**: Inspeção preventiva após período chuvoso intenso

**Detalhes**:
- **Inspetor**: João Silva
- **Prioridade**: ALTA
- **Estimativa**: 5 dias
- **Status**: ATIVO

**Áreas Incluídas**:
1. ✅ **Encosta do Morro da Cruz** - CONCLUÍDA
2. 🔄 **Vale do Jardim Petrópolis** - EM ANDAMENTO  
3. ⏳ **Córrego do Bacalhau** - PENDENTE

**Exemplo de Inspeção Realizada**:
- **Local**: Encosta do Morro da Cruz
- **Achados**: "Identificadas rachaduras em 3 residências na parte alta da encosta. Solo apresenta sinais de instabilidade após chuvas recentes. Drenagem inadequada contribui para o acúmulo de água."
- **Recomendações**: "Recomenda-se evacuação preventiva de 2 residências em situação crítica. Implementar sistema de drenagem emergencial. Monitoramento contínuo durante período chuvoso."
- **Resultado**: Risco elevado para ALTO

### 🎯 Roadmap 2: "Monitoramento Áreas Críticas - Região Sul"
**Cenário**: Acompanhamento mensal de áreas de alto risco

**Detalhes**:
- **Inspetor**: Maria Santos
- **Prioridade**: MÉDIA
- **Estimativa**: 3 dias
- **Status**: PLANEJADO

**Áreas Incluídas**:
1. ⏳ **Setor Vila Nova** - PENDENTE
2. ⏳ **Margem do Rio Meia Ponte** - PENDENTE

## 📋 Casos de Uso Práticos

### Caso 1: Criando um Novo Roadmap de Emergência

**Situação**: Fortes chuvas atingiram a cidade e é necessário verificar urgentemente 5 áreas críticas.

**Passos**:
1. Login como `admin`
2. Acesse "Área Administrativa" → "Planejar Vistorias"
3. Clique na aba "Nova Vistoria"
4. Preencha:
   ```
   Título: Vistoria Emergencial - Temporal Janeiro 2025
   Descrição: Verificação urgente de áreas críticas após temporal com ventos de 80km/h e 120mm de chuva em 6 horas
   Inspetor: Carlos Roberto
   Prioridade: ALTA
   Estimativa: 2 dias
   ```
5. Selecione as áreas prioritárias
6. Salve o roadmap

### Caso 2: Registrando uma Inspeção de Campo

**Situação**: Inspetor está em campo e precisa documentar os achados na área "Vale do Jardim Petrópolis".

**Passos**:
1. Login como `inspetor` 
2. Acesse "Área de Vistoria" → "Roadmap de Vistorias"
3. Clique na aba "Registrar Inspeção"
4. Preencha:
   ```
   Roadmap: Vistoria Região Norte - Janeiro 2025
   Área: Vale do Jardim Petrópolis
   Status: CONCLUÍDA
   Achados: Observado movimento de solo na encosta próxima às residências 15-23. Presença de trincas no pavimento da rua principal. Dois imóveis apresentam rachaduras nas paredes voltadas para a encosta.
   Recomendações: Monitoramento semanal do movimento do solo. Instalação de marcos topográficos. Orientação aos moradores sobre sinais de perigo.
   Nível de Risco: MÉDIO
   Inspetor: João Silva
   ```
5. Salve a inspeção

### Caso 3: Acompanhando o Progresso

**Situação**: Gestor precisa verificar o andamento das vistorias programadas.

**Na aba "Roadmaps"**, você verá:

```
📊 ESTATÍSTICAS GERAIS
- Total de Roadmaps: 2
- Roadmaps Ativos: 1  
- Áreas para Visitar: 4
- Inspeções Concluídas: 1

🗂️ ROADMAPS ATIVOS
┌─────────────────────────────────────────────┐
│ Vistoria Região Norte - Janeiro 2025       │
│ Prioridade: ALTA | Progresso: 33% (1/3)    │
│ Inspetor: João Silva                        │
│ ✅ Encosta do Morro da Cruz                │
│ 🔄 Vale do Jardim Petrópolis              │  
│ ⏳ Córrego do Bacalhau                     │
└─────────────────────────────────────────────┘
```

## 🎮 Guia de Teste Interativo

### Teste 1: Explorar Dados Existentes
1. Faça login como `admin`
2. Acesse o roadmap "Vistoria Região Norte"
3. Observe o progresso das áreas
4. Visualize a inspeção já registrada

### Teste 2: Simular Campo
1. Faça login como `inspetor`
2. Acesse "Roadmap de Vistorias"
3. Registre uma nova inspeção para "Vale do Jardim Petrópolis"
4. Complete os campos com dados realísticos

### Teste 3: Criar Novo Roadmap
1. Como admin, crie um roadmap para "Vistoria Pós-Temporal"
2. Selecione 3-4 áreas diferentes
3. Configure prioridade ALTA e prazo de 1 dia
4. Observe como aparece na lista

### Teste 4: Acompanhar Métricas
1. Após criar inspeções, veja as estatísticas atualizadas
2. Observe a mudança nos percentuais de progresso
3. Verifique o histórico de inspeções

## 📈 Cenários Avançados

### Cenário A: Evento Climático Extremo
```
Situação: Tornado categoria EF2 atingiu 3 bairros
Ação: Criar roadmap emergencial com 15 áreas
Prioridade: CRÍTICA
Recursos: 3 equipes de inspeção
Prazo: 24 horas
```

### Cenário B: Monitoramento Preventivo
```
Situação: Início do período chuvoso
Ação: Roadmap mensal para 20 áreas de risco
Prioridade: MÉDIA
Recursos: 2 inspetores
Prazo: 15 dias
```

### Cenário C: Validação Pós-Obra
```
Situação: Obras de contenção foram finalizadas
Ação: Vistoria técnica de 5 áreas recuperadas
Prioridade: BAIXA
Recursos: 1 engenheiro especialista
Prazo: 7 dias
```

## 💡 Dicas de Uso

### Para Gestores:
- Use prioridades para organizar a agenda das equipes
- Monitore métricas para avaliar produtividade
- Crie roadmaps temáticos (emergencial, preventivo, pós-obra)

### Para Inspetores:
- Documente achados com máximo detalhamento
- Use fotos e coordenadas quando disponível
- Atualize o status conforme avança no campo

### Para o Sistema:
- Dados são salvos automaticamente
- Histórico completo fica preservado
- Integração com áreas de risco é automática

## 🔄 Fluxo Completo de Exemplo

1. **Alerta Meteorológico** → Sistema detecta risco
2. **Planejamento** → Admin cria roadmap emergencial
3. **Mobilização** → Inspetores recebem suas rotas
4. **Execução** → Vistorias realizadas e documentadas
5. **Análise** → Dados compilados para decisões
6. **Ações** → Medidas preventivas implementadas

Este sistema proporciona uma gestão completa e eficiente das atividades de vistoria, garantindo que nenhuma área crítica seja negligenciada e que todas as informações sejam adequadamente documentadas para tomada de decisões estratégicas.
