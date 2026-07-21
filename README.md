# Blog Fullstack - Mind Group Challenge

## Tecnologias

- Node.js
- Express
- TypeScript
- Prisma ORM
- MySQL
- JWT
- Multer
- Docker

---

## Instalação

Clone o projeto:

```bash
git clone URL_DO_REPOSITORIO
```

Entre na pasta:

```bash
cd blog-fullstack-backend
```

Instale as dependências:

```bash
npm install
```

Crie o arquivo `.env` baseado no `.env.example`.

Execute as migrations:

```bash
npx prisma migrate dev
```

Inicie o servidor:

```bash
npm run dev
```

---

## Rotas de autenticação

### Registrar usuário

```http
POST /auth/register
```

### Login

```http
POST /auth/login
```

### Usuário autenticado

```http
GET /auth/me
```

---

## Rotas de posts

### Listar posts

```http
GET /posts
```

### Buscar post por ID

```http
GET /posts/:id
```

### Criar post

```http
POST /posts
```

### Atualizar post

```http
PUT /posts/:id
```

### Excluir post

```http
DELETE /posts/:id
```

---

## Docker

Subir aplicação:

```bash
docker-compose up --build
```