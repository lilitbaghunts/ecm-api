const request = require('supertest');
const app = require('../src/app');
const Product = require('../src/models/Product');
const User = require('../src/models/User');
const jwt = require('jsonwebtoken');

const products = [
  {
    name: 'Product 1',
    description: 'First product description',
    price: 100,
    stock: 10,
    imageUrl: 'http://example.com/product1.jpg',
    category: 'Electronics'
  },
  {
    name: 'Product 2',
    description: 'Second product description',
    price: 20,
    stock: 5,
    imageUrl: 'http://example.com/product2.jpg',
    category: 'Books'
  },
  {
    name: 'Product 3',
    description: 'Third product description',
    price: 150,
    stock: 2,
    imageUrl: 'http://example.com/product3.jpg',
    category: 'Electronics'
  }
];

let userToken;
let adminToken;
let productId;

describe('Product Endpoints', () => {
  beforeAll(async () => {
    const user = await User.create({
      name: 'Test User1',
      email: 'testuser1@example.com',
      passwordHash: 'password123'
    });

    userToken = jwt.sign(
      { userId: user._id, role: 'customer' },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h'
      }
    );

    adminToken = jwt.sign(
      { userId: user._id, role: 'admin' },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h'
      }
    );

    await Product.insertMany(products);
  });

  describe('GET /api/products', () => {
    it('should fetch all products', async () => {
      const response = await request(app).get('/api/products');
      expect(response.status).toBe(200);
      expect(response.body.totalProducts).toEqual(3);
    });

    it('should apply category filter', async () => {
      const response = await request(app).get(
        '/api/products?category=Electronics'
      );
      expect(response.status).toBe(200);
      expect(response.body.totalProducts).toEqual(2);
      expect(
        response.body.products.every((p) => p.category === 'Electronics')
      ).toBe(true);
    });

    it('should apply price filter', async () => {
      const response = await request(app).get(
        '/api/products?minPrice=30&&maxPrice=150'
      );
      expect(response.status).toBe(200);
      expect(response.body.totalProducts).toBe(2);
      response.body.products.forEach((product) => {
        expect(product.price).toBeGreaterThanOrEqual(30);
        expect(product.price).toBeLessThanOrEqual(150);
      });
    });
  });

  describe('POST /api/products', () => {
    it('should create a new product', async () => {
      const productData = {
        name: 'Test Product',
        description: 'A product used for testing',
        price: 19.99,
        stock: 10,
        imageUrl: 'http://example.com/image.png',
        category: 'Books'
      };
      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(productData);

      expect(response.status).toBe(201);
      expect(response.body._id).toBeDefined();

      productId = response.body._id;
    });

    it('should return 400 if product name is missing', async () => {
      const productData = {
        price: 19.99,
        stock: 10
      };
      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(productData);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Product name is required.');
    });

    it('should return 400 if product price is missing', async () => {
      const productData = {
        name: 'Test Product',
        stock: 10
      };
      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(productData);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Product price is required.');
    });

    it('should return 401 if no token is provided', async () => {
      const productData = { name: 'Unauthorized Product', price: 20 };
      const response = await request(app)
        .post('/api/products')
        .send(productData);

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Access denied');
    });

    it('should reject a non-admin user from creating a product', async () => {
      const productData = {
        name: 'Test Product',
        stock: 10
      };
      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${userToken}`)
        .send(productData);

      expect(response.status).toBe(403);
      expect(response.body.message).toBe('Access denied, admin only');
    });
  });

  describe('GET /api/products/:id', () => {
    it('should get a product', async () => {
      const response = await request(app).get(`/api/products/${productId}`);
      expect(response.status).toBe(200);
      expect(response.body._id).toEqual(productId);
    });

    it('should return 404 if product not found', async () => {
      const nonExistentProductId = '605c72ef15320757a85b1e89';
      const response = await request(app).get(
        `/api/products/${nonExistentProductId}`
      );

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Product not found');
    });
  });

  describe('PUT /api/products/:id', () => {
    it('should update a product', async () => {
      const updatedProductData = {
        name: 'Updated Test Product',
        description: 'Updated description',
        price: 25,
        stock: 20,
        imageUrl: 'http://example.com/updated-product.jpg',
        category: 'Home Appliances'
      };

      const response = await request(app)
        .put(`/api/products/${productId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updatedProductData);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Product successfully updated.');
    });

    it('should return 404 if product not found', async () => {
      const nonExistentProductId = '605c72ef15320757a85b1e89';
      const response = await request(app)
        .put(`/api/products/${nonExistentProductId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Test Product 4',
          price: '100'
        });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Product not found');
    });

    it('should return 401 if no token is provided', async () => {
      const productData = { name: 'Unauthorized Product', price: 20 };
      const response = await request(app)
        .put(`/api/products/${productId}`)
        .send(productData);

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Access denied');
    });

    it('should reject a non-admin user from updating a product', async () => {
      const productData = {
        name: 'Updated Test Product',
        stock: 10
      };
      const response = await request(app)
        .put(`/api/products/${productId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(productData);

      expect(response.status).toBe(403);
      expect(response.body.message).toBe('Access denied, admin only');
    });
  });

  describe('DELETE /api/products/:id', () => {
    it('should delete a product', async () => {
      const response = await request(app)
        .delete(`/api/products/${productId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Product successfully deleted.');
    });

    it('should return 404 if product not found', async () => {
      const nonExistentProductId = '605c72ef15320757a85b1e89';
      const response = await request(app)
        .delete(`/api/products/${nonExistentProductId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Product not found');
    });

    it('should return 401 if no token is provided', async () => {
      const response = await request(app)
        .delete(`/api/products/${productId}`)
        .send();

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Access denied');
    });

    it('should reject a non-admin user from deleting a product', async () => {
      const response = await request(app)
        .delete(`/api/products/${productId}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(403);
      expect(response.body.message).toBe('Access denied, admin only');
    });
  });
});
