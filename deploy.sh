#!/bin/bash
# Script de verificación y despliegue - Frontend
# Uso: ./deploy.sh

set -e

echo "🌐 Desplegando Frontend de Restaurante..."
echo ""

# Verificar Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker no está instalado"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose no está instalado"
    exit 1
fi

echo "✅ Docker y Docker Compose encontrados"
echo ""

# Verificar .env
if [ ! -f .env ]; then
    echo "⚠️  Archivo .env no encontrado"
    echo "📝 Creando desde .env.example..."
    cp .env.example .env
    echo ""
    echo "⚠️  IMPORTANTE: Edita el archivo .env con tus credenciales:"
    echo "   - CLOUDFLARED_TOKEN_FRONTEND"
    echo "   - PUBLIC_API_URL (opcional, por defecto usa https://restaurantebackend.prome.works)"
    echo ""
    echo "Ejecuta: nano .env"
    exit 1
fi

# Verificar que no se estén usando valores de ejemplo
if grep -q "your_token_here" .env; then
    echo "❌ El archivo .env aún tiene valores de ejemplo"
    echo "📝 Edita .env y reemplaza 'your_token_here' con tu token real"
    exit 1
fi

echo "✅ Archivo .env configurado"
echo ""

# Detener contenedores previos si existen
echo "🛑 Deteniendo contenedores previos..."
docker-compose down 2>/dev/null || true
echo ""

# Construir y levantar servicios
echo "🏗️  Construyendo imágenes..."
docker-compose build --no-cache

echo ""
echo "🚀 Levantando servicios..."
docker-compose up -d

echo ""
echo "⏳ Esperando a que los servicios estén listos..."
sleep 10

# Verificar estado
echo ""
echo "📊 Estado de contenedores:"
docker-compose ps

echo ""
echo "🔍 Verificando conectividad..."

# Esperar a que el frontend responda
MAX_RETRIES=30
RETRY_COUNT=0
while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if curl -s http://localhost:3006 > /dev/null; then
        echo "✅ Frontend respondiendo en http://localhost:3006"
        break
    fi
    RETRY_COUNT=$((RETRY_COUNT+1))
    echo "   Intento $RETRY_COUNT/$MAX_RETRIES..."
    sleep 2
done

if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
    echo "❌ Frontend no responde después de $MAX_RETRIES intentos"
    echo "📋 Ver logs con: docker-compose logs -f"
    exit 1
fi

echo ""
echo "✅ Despliegue completado exitosamente!"
echo ""
echo "📍 Acceso local:  http://localhost:3006"
echo "🌐 Acceso público: https://restaurante.prome.works"
echo ""
echo "📋 Comandos útiles:"
echo "   Ver logs:        docker-compose logs -f"
echo "   Detener:         docker-compose down"
echo "   Reiniciar:       docker-compose restart"
echo ""
