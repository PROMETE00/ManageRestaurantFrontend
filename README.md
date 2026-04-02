# 🌐 Restaurant Frontend

Aplicación web Next.js para gestión de restaurante con Cloudflare Tunnel

## 🚀 Despliegue Rápido

### 1️⃣ Clonar o hacer pull del proyecto

```bash
git pull origin main
```

### 2️⃣ Configurar variables de entorno

```bash
# Copiar plantilla
cp .env.example .env

# Editar y pegar tu token de Cloudflare
nano .env
```

**Configurar en `.env`:**
```env
CLOUDFLARED_TOKEN_FRONTEND=tu_token_aqui
PUBLIC_API_URL=https://restaurantebackend.prome.works
```

### 3️⃣ Levantar servicios

```bash
docker-compose up -d --build
```

### 4️⃣ Verificar estado

```bash
# Ver logs
docker-compose logs -f

# Verificar contenedores
docker ps

# Probar frontend localmente
curl http://localhost:3006
```

## 🌐 Acceso Público

- **Frontend Web:** https://restaurante.prome.works
- **Puerto local:** http://localhost:3006

## 📦 Stack Tecnológico

- **Next.js 15** (React 19)
- **Node.js 20**
- **Docker** + Docker Compose
- **Cloudflare Tunnel** (Zero Trust)

## 🛠️ Comandos Útiles

```bash
# Detener servicios
docker-compose down

# Ver logs del frontend
docker-compose logs -f frontend

# Reconstruir solo el frontend
docker-compose up -d --build frontend

# Entrar al contenedor
docker exec -it restaurant_web sh
```

## 🔐 Seguridad

- **NO** commitear el archivo `.env` (ya está en `.gitignore`)
- Tokens de Cloudflare se gestionan vía variables de entorno
- La variable `NEXT_PUBLIC_API_URL` es pública (se expone al navegador)

## 🔗 Integración con Backend

El frontend se conecta al backend mediante:
- **Variable de entorno:** `NEXT_PUBLIC_API_URL`
- **Valor por defecto:** `https://restaurantebackend.prome.works`

⚠️ **IMPORTANTE:** Asegúrate de que el backend esté desplegado primero.

## 🐛 Troubleshooting

**Problema:** Tunnel no conecta
```bash
# Ver logs del tunnel
docker logs tunnel_frontend

# Verificar token
echo $CLOUDFLARED_TOKEN_FRONTEND
```

**Problema:** Build falla
```bash
# Ver logs completos
docker-compose logs frontend

# Reconstruir desde cero
docker-compose down
docker-compose build --no-cache frontend
docker-compose up -d
```

**Problema:** No conecta con el backend
```bash
# Verificar variable de entorno
docker exec restaurant_web env | grep API_URL

# Probar desde el contenedor
docker exec restaurant_web wget -O- $NEXT_PUBLIC_API_URL/api/health
```

## 📝 Desarrollo Local

Si quieres desarrollar sin Docker:

```bash
# Instalar dependencias
npm install

# Crear .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:8081" > .env.local

# Modo desarrollo
npm run dev

# Build para producción
npm run build
npm start
```
