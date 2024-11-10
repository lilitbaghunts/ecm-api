const request = require('supertest');
const app = require('../../src/app');
const mongoose = require('mongoose');
const User = require('../../src/models/User');
const redisClient = require('../../src/config/redis');

let server;

describe('Auth Endpoints', () => {
  beforeAll(async () => {
    server = app.listen(process.env.PORT || 3001);
    await redisClient.flushDb();
  });

  beforeEach(async () => {
    // Clear all users before each test
    await User.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
    server.close();
    await redisClient.quit();
  });

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
      await request(app).post('/api/auth/register').send({
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'Password123'
      });
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
      await request(app).post('/api/auth/register').send({
        name: 'Login Test',
        email: 'loginuser@example.com',
        password: 'Password123'
      });
      const response = await request(app).post('/api/auth/login').send({
        email: 'loginuser@example.com',
        password: 'Password123'
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
    });

    it('should return 401 for invalid credentials', async () => {
      await request(app).post('/api/auth/register').send({
        name: 'Test User1',
        email: 'testuser1@example.com',
        password: 'Password123'
      });

      // Test case 1: Iinvalid email
      let response = await request(app).post('/api/auth/login').send({
        email: 'nonexistent@example.com',
        password: 'Password123'
      });
      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Invalid credentials');

      // Test case 2: Incorrect password
      response = await request(app).post('/api/auth/login').send({
        email: 'testuser1@example.com',
        password: 'WrongPassword'
      });
      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Invalid credentials');
    });
  });
});
