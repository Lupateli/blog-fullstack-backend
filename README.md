# Mind Group - Backend

Backend desenvolvido para o Case Técnico da Mind Group.

API REST responsável pela autenticação, gerenciamento de usuários, posts, comentários e upload de avatar.

---

## Tecnologias

- Node.js
- TypeScript
- Express
- Prisma ORM
- MySQL
- JWT
- Bcrypt
- Multer
- Swagger
- Docker
- Docker Compose

---

## Funcionalidades

- Cadastro de usuários
- Login com JWT
- Perfil do usuário
- Atualização de perfil
- Upload de avatar
- CRUD completo de Posts
- Sistema de Comentários
- Curtidas
- Visualizações
- Dashboard do usuário
- Documentação Swagger

---

## Instalação

Clone o projeto

```bash
git clone https://github.com/SEU_USUARIO/blog-fullstack-backend.git
```

Entre na pasta

```bash
cd blog-fullstack-backend
```

Instale as dependências

```bash
npm install
```

Crie o arquivo

```text
.env
```

Baseado no arquivo

```text
.env.example
```

Execute

```bash
npx prisma generate
npx prisma migrate dev
npm run dev
```

---

# Executando com Docker

Construir os containers

```bash
docker compose up --build
```

Executar em segundo plano

```bash
docker compose up -d
```

Parar

```bash
docker compose down
```

---

## Variáveis de ambiente

Exemplo:

```env
PORT=3000

DATABASE_URL=mysql://mindgroup:123456@mysql:3306/blog_db

JWT_SECRET=your_secret

MYSQL_ROOT_PASSWORD=root
MYSQL_DATABASE=blog_db
MYSQL_USER=mindgroup
MYSQL_PASSWORD=123456
```

---

## Documentação

Após iniciar o projeto:

```
http://localhost:3000/api-docs
```

---

## Estrutura

```
src
│
├── controllers
├── middleware
├── routes
├── services
├── prisma
├── uploads
└── server.ts
```

---

## Desenvolvedor

Gabriel Lupateli