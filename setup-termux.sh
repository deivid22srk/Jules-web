#!/data/data/com.termux/files/usr/bin/bash

echo "🚀 Jules Web - Setup Script para Termux"
echo "========================================"
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar se está no Termux
if [ ! -d "/data/data/com.termux" ]; then
    echo -e "${RED}❌ Este script deve ser executado no Termux${NC}"
    exit 1
fi

echo "📦 Verificando dependências..."
echo ""

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}⚠️  Node.js não encontrado. Instalando...${NC}"
    pkg update -y
    pkg install nodejs-lts -y
    echo -e "${GREEN}✅ Node.js instalado!${NC}"
else
    echo -e "${GREEN}✅ Node.js já instalado ($(node --version))${NC}"
fi

# Verificar Git
if ! command -v git &> /dev/null; then
    echo -e "${YELLOW}⚠️  Git não encontrado. Instalando...${NC}"
    pkg install git -y
    echo -e "${GREEN}✅ Git instalado!${NC}"
else
    echo -e "${GREEN}✅ Git já instalado ($(git --version))${NC}"
fi

# Verificar Bun (opcional)
if ! command -v bun &> /dev/null; then
    echo -e "${YELLOW}⚠️  Bun não encontrado. Deseja instalar? (recomendado)${NC}"
    echo "Bun é mais rápido que npm/yarn. [y/N]"
    read -r install_bun
    if [[ $install_bun =~ ^[Yy]$ ]]; then
        curl -fsSL https://bun.sh/install | bash
        export PATH="$HOME/.bun/bin:$PATH"
        echo 'export PATH="$HOME/.bun/bin:$PATH"' >> ~/.bashrc
        echo -e "${GREEN}✅ Bun instalado!${NC}"
    else
        echo -e "${YELLOW}⏩ Pulando instalação do Bun. Usando npm.${NC}"
    fi
else
    echo -e "${GREEN}✅ Bun já instalado ($(bun --version))${NC}"
fi

echo ""
echo "📥 Instalando dependências do projeto..."
echo ""

# Instalar dependências
if command -v bun &> /dev/null; then
    bun install
else
    npm install
fi

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ Dependências instaladas com sucesso!${NC}"
else
    echo ""
    echo -e "${RED}❌ Erro ao instalar dependências${NC}"
    exit 1
fi

echo ""
echo "🎉 Instalação concluída!"
echo ""
echo "Para iniciar o servidor, execute:"
echo ""
if command -v bun &> /dev/null; then
    echo -e "  ${GREEN}bun run dev${NC}"
else
    echo -e "  ${GREEN}npm run dev${NC}"
fi
echo ""
echo "Depois acesse no navegador: http://localhost:5173"
echo ""
echo "📚 Leia o TERMUX_SETUP.md para mais informações"
echo ""
