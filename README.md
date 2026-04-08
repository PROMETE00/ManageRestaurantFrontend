# Front Stack

Stack de frontend del proyecto. Aquí vive todo lo relacionado con la experiencia web, pero sin mezclar infraestructura del backend.

## Estructura

```text
front/
├── admin-web/      # Backoffice interno para operación
├── customer-web/   # Portal público para menú y reservas
├── packages/       # Cliente API y UI compartida
├── package.json    # Workspace npm del stack frontend
├── package-lock.json
└── docker-compose.yml
```

## Contexto del stack

- `admin-web`
  - Autenticación por sesión contra el backend
  - Vistas internas para mesas, reservas, pedidos y usuarios
- `customer-web`
  - Catálogo público
  - Reserva pública y consulta por referencia
- `packages`
  - `api-client`: cliente HTTP reutilizable
  - `ui`: primitives compartidas entre ambos frontends

## Ejecutar con Docker

```bash
cd /home/prome/restaurante/front
docker compose up --build
```

Puertos:

- Admin web: `http://localhost:3000`
- Customer web: `http://localhost:3001`

Variables principales:

- `NEXT_PUBLIC_API_URL`

## Ejecutar en local

```bash
cd /home/prome/restaurante/front
npm install
npm run build
npm run lint
```

Apps individuales:

```bash
cd /home/prome/restaurante/front/admin-web
npm run dev

cd /home/prome/restaurante/front/customer-web
npm run dev
```

## Notas

- Este stack no levanta base de datos ni API; depende del stack `back`.
- Los `Dockerfile` de `admin-web` y `customer-web` usan el workspace de `front/` como contexto de build.
