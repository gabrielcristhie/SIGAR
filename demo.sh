#!/bin/bash

echo "🚀 SIGAR-GO - Sistema de Informações Geográficas de Áreas de Risco"
echo "=================================================================="
echo ""

# Verificar se estamos na pasta correta
if [ ! -f "package.json" ]; then
    echo "❌ Erro: Execute este script na pasta raiz do projeto SIGAR-GO"
    exit 1
fi

# Verificar se o Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Erro: Node.js não está instalado"
    echo "   Instale o Node.js em: https://nodejs.org/"
    exit 1
fi

# Verificar se as dependências estão instaladas
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Erro na instalação das dependências"
        exit 1
    fi
    echo "✅ Dependências instaladas com sucesso"
    echo ""
fi

# Verificar se há algum processo rodando nas portas 5173/5174
if command -v ss &> /dev/null; then
    if ss -tlnp | grep -q ":5173\|:5174"; then
        echo "⚠️  Há um servidor rodando nas portas 5173 ou 5174"
        echo "   Pressione Ctrl+C se quiser parar o servidor atual"
        echo ""
    fi
fi

echo "🎯 Instruções de Uso:"
echo "───────────────────────"
echo "1. 🗺️  O mapa carregará com áreas de risco coloridas"
echo "2. 🖱️  Clique em qualquer círculo para ver detalhes"
echo "3. 🔐 Use qualquer usuário/senha para testar o login"
echo "4. 📱 Teste a responsividade redimensionando a janela"
echo ""
echo "🔍 Console do Navegador:"
echo "   É normal ver mensagens sobre 'backend não conectado'"
echo "   O sistema usa dados mockados para demonstração"
echo ""
echo "🌐 Abrindo navegador automaticamente..."
echo "   Se não abrir, acesse: http://localhost:5173 ou http://localhost:5174"
echo ""
echo "🛑 Para parar o servidor: Pressione Ctrl+C"
echo "══════════════════════════════════════════════════════"

# Tentar abrir o navegador automaticamente (funciona no Ubuntu/Linux com GUI)
if command -v xdg-open &> /dev/null; then
    # Aguardar um pouco para o servidor iniciar
    (sleep 3 && xdg-open http://localhost:5173) &
elif command -v open &> /dev/null; then
    # macOS
    (sleep 3 && open http://localhost:5173) &
fi

# Iniciar o servidor de desenvolvimento
npm run dev
