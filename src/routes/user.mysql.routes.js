import { Router } from "express";
import multer from "multer";
import * as mysqlUserController from "../controllers/user.mysql.controller.js";

const router = Router();
const upload = multer();

/**
 * @openapi
 * /api/mysql/users/{id}:
 *  get:
 *      summary: Get a user by ID from MySql
 *      tags: [MySql - Users]
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          description: User id
 *          schema:
 *              type: string
 *      responses:
 *          200:
 *            description: User details
 *            content: 
 *              application/json:
 *                  schema:
 *                       $ref: '#/components/schemas/User'
 *          400:
 *            description: Problems to execute the operation
 *          404:
 *            description: User Not found
 */
router.get('/:id', mysqlUserController.getById);

/**
 * @openapi
 * /api/mysql/users:
 *  get:
 *      summary: Get all users in MySql
 *      tags: [MySql - Users]
 *      responses:
 *          200:
 *            description: List of users
 *            content: 
 *              application/json:
 *                  schema:
 *                     type: array
 *                     items: 
 *                         $ref: '#/components/schemas/User'
 *          400: 
 *            description: Problems to execute the operation
 */
router.get('/', mysqlUserController.getAll)

/**
 * @openapi
 * /api/mysql/users:
 *  post:
 *      summary: Create a new user in MySql
 *      tags: [MySql - Users]
 *      requestBody:
 *       required: true
 *       content:
 *         multipart/formdata:
 *           schema:
 *             $ref: '#/components/schemas/UserCreateRequest'
 *      responses:
 *          201:
 *            description: User created successfully
 *          400:
 *            description: Problems to execute the operation
 */
router.post('/', upload.single('file'), mysqlUserController.create);

/**
 * @openapi
 * /api/mysql/users/{id}:
 *   patch:
 *     summary: Update partially a user by ID in MySql
 *     tags: [MySql - Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The user ID
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         multipart/formdata:
 *           schema:
 *             $ref: '#/components/schemas/UserCreateRequest'
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Problems to execute the operation
 *       404:
 *         description: User not found
 */
router.patch('/:id', upload.single('file'), mysqlUserController.update);

/**
 * @openapi
 * /api/mysql/users/{id}:
 *   delete:
 *     summary: Delete a user by ID in MySql
 *     tags: [MySql - Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       400:
 *         description: Problems to execute the operation
 *       404:
 *         description: User not found
 */
router.delete('/:id', mysqlUserController.remove);

export default router;