# 👤 Usuários Disponíveis no Sistema SIGAR-GO

## 🎯 Usuários Configurados

O sistema atualmente possui **3 usuários de demonstração** configurados:

### 1. **Admin** (`admin`)
- **Login**: `admin` / qualquer senha
- **Role**: `admin` 
- **Nome**: "Usuário Simulado"
- **Email**: admin@sigar.go.gov.br
- **Acesso**: 
  - ✅ Área Administrativa completa
  - ✅ Gerenciar Solicitações
  - ✅ Vistorias (roadmap)
  - ✅ Todas as funcionalidades

### 2. **Demo** (`demo`)
- **Login**: `demo` / qualquer senha  
- **Role**: `admin`
- **Nome**: "Usuário Simulado"
- **Email**: demo@sigar.go.gov.br
- **Acesso**: Igual ao admin
- **Usado para**: Demonstrações e testes

### 3. **Inspetor** (`inspetor`)
- **Login**: `inspetor` / qualquer senha
- **Role**: `inspector`
- **Nome**: "Inspetor de Campo" 
- **Email**: inspetor@sigar.go.gov.br
- **Acesso**:
  - ✅ Área de Vistoria
  - ✅ Vistorias (roadmap)
  - ❌ Sem acesso à Área Administrativa

---

## 📊 Dados Compartilhados

**Todos os 3 usuários** compartilham os mesmos dados de exemplo:
- **85 tokens** SIGAR Coins
- **4 submissões** de exemplo (aprovadas, rejeitadas, pendentes)
- **Histórico completo** de transações
- **Dados de votação** e penalidades

---

## 🔧 Diferenças por Role

### **Admin** (`admin` e `demo`)
```
Sidebar:
├── ➕ Incluir Área de Risco
├── 🗑️ Remover Área de Risco  
├── 🛡️ Área Administrativa
│   ├── 📋 Gerenciar Solicitações
│   └── 🗺️ Vistorias
└── 📋 Legenda de Risco
```

### **Inspector** (`inspetor`)
```
Sidebar:
├── ➕ Incluir Área de Risco
├── 🗑️ Remover Área de Risco
├── 🔍 Área de Vistoria
│   └── 📍 Vistorias
└── 📋 Legenda de Risco
```

---

## 🎪 Recomendação para Demonstração

### **Para Administradores/Gestores:**
- Use: `admin` ou `demo`
- Demonstre: Planejamento, gerenciamento, visão geral

### **Para Inspetores de Campo:**
- Use: `inspetor`  
- Demonstre: Execução, registro de inspeções

### **Para Usuários Finais/Cidadãos:**
- Use: `demo`
- Demonstre: Votação, submissões, participação

---

## 💡 Sugestão de Melhoria

**Atualmente**: Apenas 2 tipos de usuário (admin/inspector)

**Poderia ter**:
1. **`admin`** - Administrador geral
2. **`gestor`** - Gestor de equipes  
3. **`inspetor`** - Inspetor de campo
4. **`cidadao`** - Usuário comum (votação/submissões)

**Implementação simples**: Adicionar mais condições na função de login e ajustar permissões no sidebar.

---

## ✅ Status Atual

**Funcional**: ✅ 3 usuários funcionais  
**Roles**: ✅ 2 tipos (admin, inspector)  
**Permissões**: ✅ Diferenciadas por role  
**Dados**: ✅ Compartilhados entre usuários  

O sistema está adequado para demonstração com diferentes perfis de usuário! 🎯
