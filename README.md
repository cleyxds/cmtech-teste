![Logo](./cmtech.png)

# CMTech App

CMTech é uma aplicação de gerenciamento de usuários, contatos, telefones e endereços, com backend em PHP nativo e frontend em React + Vite.

> Tentei utilizar o Scriptcase para acelerar a entrega, mas o tempo de aprendizado e a adaptação ao ambiente consumiriam muito do prazo. Por isso, optei por implementar o CRUD em PHP puro, mantendo a arquitetura modular e a separação clara de responsabilidades.

# Appendix

Este repositório contém duas camadas principais:

- `backend/`: API em PHP 8 com arquitetura Controller → Service → Repository
- `frontend/`: SPA em React 19 + Vite + TypeScript
- `dev.compose.yaml`: orquestração local do MySQL para desenvolvimento

## 1. Tecnologias e arquitetura

- Backend: PHP 8.x, PDO, MVC leve, Repository / Service Layer
- Frontend: React 19, Vite, TypeScript, React Router, Axios
- Banco de dados: MySQL 8
- Orquestração: Docker Compose (`dev.compose.yaml`)

##### Estrutura principal:

- `backend/public`: ponto de entrada do servidor PHP
- `backend/src`: código PHP organizado em controllers, services, repositories, core e exceptions
- `backend/database`: migrations e scripts SQL
- `frontend/src`: código React + TypeScript
- `dev.compose.yaml`: serviço MySQL local

## 2. Pré-requisitos

- Docker e Docker Compose instalados
- Node.js 20+ e npm/yarn para executar o frontend localmente
- PHP 8.x para rodar o backend sem Docker

## 3. Configuração de ambiente

Os dados de conexão do backend estão configurados para MySQL local:

- host: `127.0.0.1`
- port: `3306`
- database: `cmtech`
- user: `root`
- password: `root`

O Docker Compose já expõe esse serviço em `localhost:3306`.

## 4. Como rodar localmente com Docker (recomendado)

Na raiz do projeto:

```bash
docker compose -f dev.compose.yaml up -d
```

Em seguida, aplique a migration do MySQL:

```bash
mysql -h 127.0.0.1 -P 3306 -u root -proot cmtech < backend/database/init.sql
```

### Backend

Rode o servidor PHP na raiz do projeto:

```bash
php -S 127.0.0.1:8000 -t backend/public
```

### Frontend

Abra outro terminal em `frontend/`:

```bash
cd frontend
npm install
npm run dev
```

### Endpoints principais

- Backend API: `http://127.0.0.1:8000`
- Frontend: URL exibida pelo Vite (normalmente `http://127.0.0.1:5173`)

## 5. Execução sem Docker (opcional)

### Backend

```bash
cd backend
php -S 127.0.0.1:8000 -t public
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## 6. Decisões técnicas

- Mantive PHP nativo para demonstrar arquitetura limpa sem frameworks.
- Usei PDO e repositórios para isolar acesso a dados e facilitar testes futuros.
- O frontend foi implementado com React + Vite para uma interface SPA leve e moderna.
- A camada de backend separa controllers, services e repositories para delegar responsabilidades claramente.
- O MySQL local via Docker Compose simplifica o setup de banco para desenvolvimento.

## 7. Banco de dados e scripts

- Banco padrão: MySQL 8
- Migration principal: `backend/database/migrations/2026_06_09_000001_create_users_phones_addresses_tables.sql`
- O `dev.compose.yaml` já cria o banco `cmtech` com `root/root`.

## 8. Autor

- **Cleyson Barbosa**
