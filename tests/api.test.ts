import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import app from '../src/app';
import prisma from '../src/config/prisma';

function makeEmail() {
  return `vitest-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`;
}

async function cleanupUser(email: string) {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (!user) return;

  await prisma.like.deleteMany({ where: { userId: user.id } });
  await prisma.post.deleteMany({ where: { authorId: user.id } });
  await prisma.user.delete({ where: { id: user.id } });
}

describe('backend API', () => {
  const createdEmails: string[] = [];

  beforeAll(() => {
    process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';
  });

  afterAll(async () => {
    await Promise.all(createdEmails.map((email) => cleanupUser(email)));
    await prisma.$disconnect();
  });

  it('registers a user', async () => {
    const email = makeEmail();
    createdEmails.push(email);

    const response = await request(app)
      .post('/auth/register')
      .send({
        name: 'Vitest User',
        email,
        password: 'secret123',
      });

    expect(response.status).toBe(201);
    expect(response.body.email).toBe(email);
  });

  it('logs in a user and returns a token', async () => {
    const email = makeEmail();
    createdEmails.push(email);

    await request(app).post('/auth/register').send({
      name: 'Vitest Login',
      email,
      password: 'secret123',
    });

    const response = await request(app).post('/auth/login').send({
      email,
      password: 'secret123',
    });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeTruthy();
    expect(response.body.user.email).toBe(email);
  });

  it('creates a post for an authenticated user', async () => {
    const email = makeEmail();
    createdEmails.push(email);

    const registerResponse = await request(app).post('/auth/register').send({
      name: 'Vitest Author',
      email,
      password: 'secret123',
    });

    const loginResponse = await request(app).post('/auth/login').send({
      email,
      password: 'secret123',
    });

    const response = await request(app)
      .post('/posts')
      .set('Authorization', `Bearer ${loginResponse.body.token}`)
      .field('title', 'Post de teste')
      .field('content', 'Conteúdo de teste')
      .field('category', 'Tech');

    expect(response.status).toBe(201);
    expect(response.body.title).toBe('Post de teste');
  });

  it('lists posts and shows like metadata', async () => {
    const email = makeEmail();
    createdEmails.push(email);

    const registerResponse = await request(app).post('/auth/register').send({
      name: 'Vitest Reader',
      email,
      password: 'secret123',
    });

    const loginResponse = await request(app).post('/auth/login').send({
      email,
      password: 'secret123',
    });

    await request(app)
      .post('/posts')
      .set('Authorization', `Bearer ${loginResponse.body.token}`)
      .field('title', 'Lista de teste')
      .field('content', 'Conteúdo listado')
      .field('category', 'General');

    const response = await request(app).get('/posts');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body[0]).toMatchObject({
      title: 'Lista de teste',
      likesCount: 0,
      likedByCurrentUser: false,
    });
  });

  it('increments views on a post', async () => {
    const email = makeEmail();
    createdEmails.push(email);

    const loginResponse = await request(app).post('/auth/register').send({
      name: 'Vitest Viewer',
      email,
      password: 'secret123',
    });

    const authResponse = await request(app).post('/auth/login').send({
      email,
      password: 'secret123',
    });

    const createdPost = await request(app)
      .post('/posts')
      .set('Authorization', `Bearer ${authResponse.body.token}`)
      .field('title', 'Visualização')
      .field('content', 'Conteúdo da visualização')
      .field('category', 'News');

    const response = await request(app).patch(`/posts/${createdPost.body.id}/view`);

    expect(response.status).toBe(200);
    expect(response.body.views).toBeGreaterThanOrEqual(1);
  });

  it('likes and unlikes a post', async () => {
    const email = makeEmail();
    createdEmails.push(email);

    const authResponse = await request(app).post('/auth/register').send({
      name: 'Vitest Liker',
      email,
      password: 'secret123',
    });

    const loginResponse = await request(app).post('/auth/login').send({
      email,
      password: 'secret123',
    });

    const createdPost = await request(app)
      .post('/posts')
      .set('Authorization', `Bearer ${loginResponse.body.token}`)
      .field('title', 'Curtir')
      .field('content', 'Conteúdo para curtir')
      .field('category', 'Social');

    const likeResponse = await request(app)
      .post(`/posts/${createdPost.body.id}/like`)
      .set('Authorization', `Bearer ${loginResponse.body.token}`);

    expect(likeResponse.status).toBe(201);

    const unlikeResponse = await request(app)
      .delete(`/posts/${createdPost.body.id}/like`)
      .set('Authorization', `Bearer ${loginResponse.body.token}`);

    expect(unlikeResponse.status).toBe(200);
  });

  it('prevents another user from updating a post', async () => {
    const authorEmail = makeEmail();
    const otherEmail = makeEmail();
    createdEmails.push(authorEmail, otherEmail);

    const authorLogin = await request(app).post('/auth/register').send({
      name: 'Vitest Author',
      email: authorEmail,
      password: 'secret123',
    });

    const otherLogin = await request(app).post('/auth/register').send({
      name: 'Vitest Other',
      email: otherEmail,
      password: 'secret123',
    });

    const authorAuth = await request(app).post('/auth/login').send({
      email: authorEmail,
      password: 'secret123',
    });

    const otherAuth = await request(app).post('/auth/login').send({
      email: otherEmail,
      password: 'secret123',
    });

    const createdPost = await request(app)
      .post('/posts')
      .set('Authorization', `Bearer ${authorAuth.body.token}`)
      .field('title', 'Protegido')
      .field('content', 'Conteúdo protegido')
      .field('category', 'Protected');

    const response = await request(app)
      .put(`/posts/${createdPost.body.id}`)
      .set('Authorization', `Bearer ${otherAuth.body.token}`)
      .send({ title: 'Novo título' });

    expect(response.status).toBe(403);
  });

  it('prevents another user from deleting a post', async () => {
    const authorEmail = makeEmail();
    const otherEmail = makeEmail();
    createdEmails.push(authorEmail, otherEmail);

    const authorAuth = await request(app).post('/auth/register').send({
      name: 'Vitest Author',
      email: authorEmail,
      password: 'secret123',
    });

    const otherAuth = await request(app).post('/auth/register').send({
      name: 'Vitest Other',
      email: otherEmail,
      password: 'secret123',
    });

    const authorLogin = await request(app).post('/auth/login').send({
      email: authorEmail,
      password: 'secret123',
    });

    const otherLogin = await request(app).post('/auth/login').send({
      email: otherEmail,
      password: 'secret123',
    });

    const createdPost = await request(app)
      .post('/posts')
      .set('Authorization', `Bearer ${authorLogin.body.token}`)
      .field('title', 'Não deletar')
      .field('content', 'Conteúdo a proteger')
      .field('category', 'Protected');

    const response = await request(app)
      .delete(`/posts/${createdPost.body.id}`)
      .set('Authorization', `Bearer ${otherLogin.body.token}`);

    expect(response.status).toBe(403);
  });
});
