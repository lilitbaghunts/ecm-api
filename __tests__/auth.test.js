const request = require('supertest');
const app = require('../src/app');
const { success, errors } = require('../src/common/messages');

describe('Auth Endpoints', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const response = await request(app).post('/api/auth/register').send({
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'Password123'
      });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe(success.USER_REGISTERED);
    });

    it('should not register a new user', async () => {
      const response = await request(app).post('/api/auth/register').send({
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'Password123'
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe(errors.USER_EXISTS);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should log in a registered user', async () => {
      const response = await request(app).post('/api/auth/login').send({
        email: 'testuser@example.com',
        password: 'Password123'
      });

      expect(response.status).toBe(200);
      expect(response.body.token).toBeDefined();
    });

    it('should return 401 for invalid credentials', async () => {
      // Test case 1: Invalid email
      let response = await request(app).post('/api/auth/login').send({
        email: 'nonexistent@example.com',
        password: 'Password123'
      });
      expect(response.status).toBe(401);
      expect(response.body.message).toBe(errors.INVALID_CREDENTIALS);

      // Test case 2: Incorrect password
      response = await request(app).post('/api/auth/login').send({
        email: 'testuser@example.com',
        password: 'WrongPassword'
      });
      expect(response.status).toBe(401);
      expect(response.body.message).toBe(errors.INVALID_CREDENTIALS);
    });
  });
});
