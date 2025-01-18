/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get list of products
 *     tags:
 *       - Products
 *     description: Retrieve a list of products with optional filters and pagination.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number for pagination (default is 1).
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: The number of products to return per page (default is 50).
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter products by name (case-insensitive partial match).
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter products by category.
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *           format: float
 *         description: Filter products with a price greater than or equal to this value.
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *           format: float
 *         description: Filter products with a price less than or equal to this value.
 *     responses:
 *       200:
 *         description:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   price:
 *                     type: number
 *                   description:
 *                     type: string
 *                   stock:
 *                     type: number
 *                   category:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 */

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product.
 *     tags:
 *       - Products
 *     description: Admin-only route to create a new product.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *               category:
 *                 type: string,
 *               stock:
 *                 type: number,
 *               imageUrl:
 *                 type: string
 *     responses:
 *       201:
 *         description:
 *       401:
 *         description: Access denied
 *       403:
 *         description: Access denied, admin only
 *       400:
 *         description: Invalid input. Multiple fields might be missing.
 */

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get product details by ID.
 *     tags:
 *       - Products
 *     description: Retrieve detailed information about a specific product using its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 category:
 *                   type: string
 *                 description:
 *                   type: string
 *                 price:
 *                   type: number
 *                   format: float
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Product not found
 */

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update an existing product
 *     tags:
 *       - Products
 *     description: Update the details of a product. Admin access required.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *             example:
 *               name: "Updated Product Name"
 *               category: "Updated Category"
 *               price: 19.99
 *               description: "Updated description"
 *     responses:
 *       200:
 *         description:
 *       401:
 *         description: Access denied
 *       403:
 *         description: Access denied, admin only
 *       404:
 *         description: Product not found
 */

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product by ID.
 *     tags:
 *       - Products
 *     description: Deletes the product specified by the ID from the database.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the product to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted successfully.
 *       400:
 *         description: Invalid product ID.
 *       404:
 *         description: Product not found.
 *       500:
 *         description: Server error.
 */
