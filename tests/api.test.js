const request = require('supertest');
const app = require('../src/app');

beforeEach(() => app.resetData());

describe('API REST - 6 endpoints', () => {
  it('GET /api/health responde 200 y status ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  it('GET /api/users devuelve lista vacia al inicio', async () => {
    const res = await request(app).get('/api/users');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('POST /api/users crea un usuario (201)', async () => {
    const res = await request(app).post('/api/users').send({ name: 'Ana', email: 'ana@mail.com' });
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({ id: 1, name: 'Ana', email: 'ana@mail.com' });
  });

  it('POST /api/users sin datos devuelve 400', async () => {
    const res = await request(app).post('/api/users').send({});
    expect(res.statusCode).toBe(400);
  });

  it('GET /api/users/:id devuelve el usuario creado', async () => {
    await request(app).post('/api/users').send({ name: 'Ana', email: 'ana@mail.com' });
    const res = await request(app).get('/api/users/1');
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Ana');
  });

  it('GET /api/users/:id inexistente devuelve 404', async () => {
    const res = await request(app).get('/api/users/999');
    expect(res.statusCode).toBe(404);
  });

  it('PUT /api/users/:id actualiza el usuario', async () => {
    await request(app).post('/api/users').send({ name: 'Ana', email: 'ana@mail.com' });
    const res = await request(app).put('/api/users/1').send({ name: 'Ana Maria' });
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Ana Maria');
  });

  it('PUT /api/users/:id actualiza el email', async () => {
    await request(app).post('/api/users').send({ name: 'Ana', email: 'ana@mail.com' });
    const res = await request(app).put('/api/users/1').send({ email: 'nuevo@mail.com' });
    expect(res.body.email).toBe('nuevo@mail.com');
  });

  it('PUT /api/users/:id sin cuerpo devuelve 400', async () => {
    await request(app).post('/api/users').send({ name: 'Ana', email: 'ana@mail.com' });
    const res = await request(app).put('/api/users/1').send({});
    expect(res.statusCode).toBe(400);
  });

  it('PUT /api/users/:id inexistente devuelve 404', async () => {
    const res = await request(app).put('/api/users/999').send({ name: 'X' });
    expect(res.statusCode).toBe(404);
  });

  it('DELETE /api/users/:id elimina el usuario', async () => {
    await request(app).post('/api/users').send({ name: 'Ana', email: 'ana@mail.com' });
    const res = await request(app).delete('/api/users/1');
    expect(res.statusCode).toBe(200);
    const list = await request(app).get('/api/users');
    expect(list.body).toEqual([]);
  });

  it('DELETE /api/users/:id inexistente devuelve 404', async () => {
    const res = await request(app).delete('/api/users/999');
    expect(res.statusCode).toBe(404);
  });
});
