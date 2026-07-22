# Mind Group - Backend

Backend da plataforma **Mind Group**, um sistema de publicação de artigos desenvolvido com Node.js, Express, TypeScript e Prisma.

A API fornece autenticação JWT, gerenciamento de usuários, artigos, comentários, curtidas, visualizações e upload de imagens de perfil.

---

## Tecnologias

- Node.js
- Express
- TypeScript
- Prisma ORM
- MySQL
- JWT Authentication
- Bcrypt
- Multer
- Swagger
- Vitest

---

## Funcionalidades

### Autenticação

- Cadastro de usuários
- Login com JWT
- Proteção de rotas
- Middleware de autenticação

### Perfil

- Atualização de nome
- Atualização de e-mail
- Atualização da biografia
- Upload de avatar
- Consulta do usuário autenticado

### Artigos

- Criar artigo
- Editar artigo
- Excluir artigo
- Listar artigos
- Buscar artigo por ID

### Comentários

- Criar comentários
- Listar comentários por artigo
- Excluir comentários

### Curtidas

- Curtir artigos
- Remover curtidas

### Visualizações

- Contador automático de visualizações

### Dashboard

- Estatísticas do usuário
- Quantidade de artigos
- Curtidas recebidas
- Visualizações

---

## Estrutura

```
src
│
├── config
├── controllers
├── middlewares
├── prisma
├── routes
├── services
├── types
├── utils
└── server.ts
```

---

## Instalação

Clone o projeto

```bash
git clone https://github.com/Lupateli/blog-fullstack-backend.git
```

Entre na pasta

```bash
cd blog-fullstack-backend
```

Instale as dependências

```bash
npm install
```

Configure o arquivo `.env`

```env
DATABASE_URL=
JWT_SECRET=
PORT=3000
```

Execute as migrations

```bash
npx prisma migrate dev
```

Execute o projeto

```bash
npm run dev
```

---

## Scripts

```bash
npm run dev
```

Inicia o servidor em desenvolvimento.

```bash
npm run build
```

Compila o projeto.

```bash
npm start
```

Executa a versão compilada.

```bash
npm run typecheck
```

Verifica erros de TypeScript.

```bash
npm test
```

Executa os testes.

---

## Upload de arquivos

Os avatares enviados são armazenados em

```
uploads/avatars
```

e disponibilizados através de

```
/uploads/avatars/nome-do-arquivo.ext
```

---

## Documentação

A API possui documentação utilizando Swagger.

Após iniciar o servidor, acesse:

```
http://localhost:3000/api-docs
```

---

## Próximas melhorias

- Recuperação de senha
- Alteração de senha
- Upload de banner dos artigos
- Paginação
- Sistema de tags
- Categorias relacionais

---

## Autor

Desenvolvido por **Gabriel Lupateli**