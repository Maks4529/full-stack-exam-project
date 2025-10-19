# Toolkit Exam Project 2025-01

Full‑stack app (React + Node.js/Express + PostgreSQL + MongoDB + Socket.IO).

### Quick links

- Docker (dev): see Run with Docker (development)
- Docker (prod): see Run with Docker (production)
- Local: see Run locally (without Docker)
- Test credentials: see Test accounts and cards

## Prerequisites

- Node.js 16+ (for local runs)
- Docker + Docker Compose (for containerized runs)
- PostgreSQL and MongoDB (only for local runs without Docker)

## Environment & configuration

Server uses JSON configs instead of .env for databases:

- `server/src/config/postgresConfig.json`
  - development: host `localhost`, db `squad-help-dev`, user `postgres`, password `54321`
  - test: host `localhost`, db `squad-help-test`, user `postgres`, password `admin`
  - production: host `localhost`, db `squad-help-prod`, user `postgres`, password `admin`
- `server/src/config/mongoConfig.json`
  - development: host `localhost`, port `27017`, db `squadhelp-chat-dev`
  - production: host `localhost`, port `27017`, db `squadhelp-chat-prod`

Other runtime settings:

- Server port: `process.env.PORT || 5000` (dev). Docker maps to `3000` internally.
- Static images directory: `/var/www/html/images` (mounted in Docker), client reads from `public/images` in dev.

Client base URLs (in `client/src/constants.js`):

- API base: `http://localhost:5000/` (dev)
- Public images (dev): `http://localhost:5000/public/images/`
- Public images (prod via Nginx): `http://localhost:80/images/`

## Run with Docker (development)

Docker compose file: `docker-compose-dev.yaml`.

```bash
docker compose -f docker-compose-dev.yaml up --build
```

Services:

- front-react: serves Vite dev server on host `http://localhost:5000`
- server-dev: Node server on host `http://localhost:3000` (internal port 3000)
- db-dev: Postgres on host `localhost:12346`
- mongo-dev: MongoDB on host `localhost:12345`

Notes:

- Volumes mount `./var/www/html/images` for uploads and code for hot reload.
- Migrations/seeders are not auto-run by default. Exec into server container to run if needed:

```bash
docker compose -f docker-compose-dev.yaml exec server-dev npx sequelize-cli db:migrate
docker compose -f docker-compose-dev.yaml exec server-dev npx sequelize-cli db:seed:all
```

## Run with Docker (production)

Docker compose file: `docker-compose.yaml`.

```bash
docker compose -f docker-compose.yaml up --build -d
```

Services:

- client-prod: Nginx on `http://localhost:80`
- server-prod: Node API on `http://localhost:3000`
- db-prod: Postgres on `localhost:5432` (inside compose network name `db-prod`)
- mongo-prod: MongoDB on `localhost:27017`

Volumes:

- `/var/www/html/images` is mounted to persist uploaded images.

Run migrations/seeders (if the image doesn’t do it automatically):

```bash
docker compose -f docker-compose.yaml exec server-prod npx sequelize-cli db:migrate
docker compose -f docker-compose.yaml exec server-prod npx sequelize-cli db:seed:all
```

## Run locally (without Docker)

1. Install dependencies

```bash
cd server && npm install
cd ../client && npm install
```

2. Start databases locally

- PostgreSQL: create database `squad-help-dev` with user `postgres` and password `54321` (or adjust `server/src/config/postgresConfig.json`).
- MongoDB: run on `localhost:27017`.

3. Run migrations and seeders

```bash
cd server
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

4. Start backend

```bash
cd server
npm start
# Server listens on http://localhost:5000
```

5. Start frontend

```bash
cd client
npm start
# Frontend dev server on http://localhost:5000
```

## Test accounts and cards

Users (from seeders in `server/src/seeders`):

- Customer: email `buyer@gmail.com`, password `123456`
- Creator: email `creative@gmail.com`, password `123456`
- Moderator: email `moderator@gmail.com`, password `123456`

Bank cards (from `20250830000001-Bank.js`):

- Platform bank (no balance):
  - Number: `4564654564564564`
  - Name: `SquadHelp`
  - Expiry: `11/26`
  - CVC: `453`
- Test user card (balance 5000):
  - Number: `4111111111111111`
  - Name: `yriy`
  - Expiry: `09/26`
  - CVC: `505`

## Troubleshooting

- If client can’t reach API: ensure server runs at `http://localhost:5000` in dev, or update `client/src/constants.js` `BASE_URL`.
- If migrations fail: verify Postgres connection values match `server/src/config/postgresConfig.json` and the container port mapping.
- Images not showing: confirm `/var/www/html/images` volume is mounted and client `publicURL` matches environment.
