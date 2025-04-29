import { Router } from "express";
import multer from "multer";
import * as mongoDbUserController from "../controllers/user.mongodb.controller.js";


const router = Router();
const upload = multer();

/**
 * @openapi
 * /api/mongodb/users/{id}:
 *  get:
 *      summary: Get a user by ID from MongoDB
 *      tags: [MongoDB - Users]
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
router.get('/:id', mongoDbUserController.getById);

/**
 * @openapi
 * /api/mongodb/users:
 *  get:
 *      summary: Get all users in MongoDB
 *      tags: [MongoDB - Users]
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
router.get('/', mongoDbUserController.getAll);

/**
 * @openapi
 * components:
 *      schemas:
 *          UserCreateRequest:
 *              type: object
 *              properties:
 *                  name:
 *                     type: string
 *                     description: Nombre del usuario
 *                     example: Valentin Hernandez
 *                  password:
 *                     type: string
 *                     description: Contraseña del usuario
 *                     example: valentin@gmail.com
 *                  date_signup:
 *                     type: string
 *                     description: Fecha de registro
 *                     example: 20/04/2025
 *                  file:
 *                     type: file
 *                     format: binary
 *                     description: Imagen de perfil del usuario
 *                  description:
 *                    type: string
 *                    description: Descripción del usuario
 */

/**
 * @openapi
 * /api/mongodb/users:
 *  post:
 *      summary: Create a new user in MongoDB
 *      tags: [MongoDB - Users]
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
router.post('/', upload.single('file'), mongoDbUserController.create);

/**
 * @openapi
 * /api/mongodb/users/{id}:
 *   patch:
 *     summary: Update partially a user by ID in MongoDB
 *     tags: [MongoDB - Users]
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
 *         description: Error to update the image
 *       404:
 *         description: User not found
 */
router.patch('/:id', upload.single('file'), mongoDbUserController.update);

/**
 * @openapi
 * /api/mongodb/users/{id}:
 *   delete:
 *     summary: Delete a user by ID in MongoDB
 *     tags: [MongoDB - Users]
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
router.delete('/:id', mongoDbUserController.remove);

export default router;