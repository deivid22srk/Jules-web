#!/bin/bash

echo "🚀 Iniciando Jules Web..."
echo ""

# Verificar se as dependências estão instaladas
if [ ! -d "node_modules" ]; then
    echo "📦 Dependências não encontradas. Instalando..."
    if command -v bun &> /dev/null; then
        bun install
    else
        npm install
    fi
    echo ""
fi

# Iniciar servidor
echo "✅ Iniciando servidor de desenvolvimento..."
echo ""
echo "🌐 Acesse no navegador:"
echo "   Local: http://localhost:5173"
echo ""
echo "💡 Pressione Ctrl+C para parar o servidor"
echo ""

if command -v bun &> /dev/null; then
    bun run dev
else
    npm run dev
fi
