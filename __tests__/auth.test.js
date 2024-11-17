const request = require('supertest');
const app = require('../src/app');

describe('Auth Endpoints', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const response = await request(app).post('/api/auth/register').send({
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'Password123'
      });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('User registered successfully');
    });

    it('should not register a new user', async () => {
      const response = await request(app).post('/api/auth/register').send({
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'Password123'
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Email already registered');
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
      expect(response.body.message).toBe('Invalid credentials');

      // Test case 2: Incorrect password
      response = await request(app).post('/api/auth/login').send({
        email: 'testuser@example.com',
        password: 'WrongPassword'
      });
      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Invalid credentials');
    });
  });
});
