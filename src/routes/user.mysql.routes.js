import { Router } from "express";
import multer from "multer";
import * as mysqlUserController from "../controllers/user.mysql.controller.js";

const router = Router();
const upload = multer();

router.get('/:id', mysqlUserController.getById);

router.get('/', mysqlUserController.getAll)

router.post('/', upload.single('file'), mysqlUserController.create);

router.patch('/:id', upload.single('file'), mysqlUserController.update);

router.delete('/:id', mysqlUserController.remove);

export default router;