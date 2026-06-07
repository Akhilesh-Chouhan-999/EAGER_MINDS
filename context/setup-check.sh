#!/bin/bash
# EagerMinds - Setup & Testing Helper Script

echo "╔════════════════════════════════════════════════════════════╗"
echo "║   EagerMinds Bookmarks - Setup & Testing Helper           ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check if file exists
check_env_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} Found: $1"
        return 0
    else
        echo -e "${RED}✗${NC} Missing: $1"
        return 1
    fi
}

# Function to check environment variable
check_env_var() {
    local var_name=$1
    local file=$2
    local value=$(grep "^${var_name}=" "$file" 2>/dev/null | cut -d'=' -f2)
    
    if [ -z "$value" ]; then
        echo -e "${RED}  ✗${NC} $var_name: Not set"
        return 1
    else
        # Mask sensitive values
        if [[ "$var_name" == *"KEY"* ]] || [[ "$var_name" == *"SECRET"* ]]; then
            masked="${value:0:8}...${value: -4}"
        else
            masked="$value"
        fi
        echo -e "${GREEN}  ✓${NC} $var_name: $masked"
        return 0
    fi
}

echo -e "${BLUE}1. Checking File Structure...${NC}"
check_env_file "backend/.env"
check_env_file "frontend/.env.local"
echo ""

echo -e "${BLUE}2. Checking Backend Environment Variables...${NC}"
if [ -f "backend/.env" ]; then
    check_env_var "PORT" "backend/.env"
    check_env_var "SUPABASE_URL" "backend/.env"
    check_env_var "SUPABASE_ANON_KEY" "backend/.env"
    check_env_var "RESEND_API_KEY" "backend/.env"
    echo ""
fi

echo -e "${BLUE}3. Checking Frontend Environment Variables...${NC}"
if [ -f "frontend/.env.local" ]; then
    check_env_var "VITE_API_BASE_URL" "frontend/.env.local"
    echo ""
fi

echo -e "${BLUE}4. Checking Dependencies...${NC}"
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓${NC} Root node_modules exists"
else
    echo -e "${RED}✗${NC} Root node_modules missing"
fi

if [ -d "backend/node_modules" ]; then
    echo -e "${GREEN}✓${NC} Backend node_modules exists"
else
    echo -e "${RED}✗${NC} Backend node_modules missing"
fi

if [ -d "frontend/node_modules" ]; then
    echo -e "${GREEN}✓${NC} Frontend node_modules exists"
else
    echo -e "${RED}✗${NC} Frontend node_modules missing"
fi
echo ""

echo -e "${BLUE}5. Checking Database Connection...${NC}"
read -p "Enter Supabase URL (from backend/.env): " supabase_url
if curl -s -o /dev/null -w "%{http_code}" "$supabase_url/rest/v1/" | grep -q "200\|401"; then
    echo -e "${GREEN}✓${NC} Supabase connection OK"
else
    echo -e "${RED}✗${NC} Supabase connection failed"
fi
echo ""

echo -e "${BLUE}6. Suggested Next Steps:${NC}"
echo ""
echo -e "${YELLOW}If you need credentials:${NC}"
echo "1. Resend API Key: https://resend.com"
echo "2. Google OAuth: https://console.cloud.google.com"
echo ""
echo -e "${YELLOW}To start development:${NC}"
echo "  npm run dev          # Start frontend & backend"
echo "  npm run dev:backend  # Start backend only"
echo "  npm run dev:frontend # Start frontend only"
echo ""
echo -e "${YELLOW}To test:${NC}"
echo "  npm test             # Run all tests"
echo "  npm run test:backend # Backend tests only"
echo "  npm run test:frontend # Frontend tests only"
echo ""
echo -e "${YELLOW}Health check:${NC}"
echo "  curl http://localhost:5000/health"
echo ""

