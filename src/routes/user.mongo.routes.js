import { Router } from "express";
import multer from "multer";
import * as mongoDbUserController from "../controllers/user.mongodb.controller.js";


const router = Router();
const upload = multer();

router.get('/:id', mongoDbUserController.getById);

router.get('/', mongoDbUserController.getAll);

router.post('/', upload.single('file'), mongoDbUserController.create);

router.patch('/:id', upload.single('file'), mongoDbUserController.update);

router.delete('/:id', mongoDbUserController.remove);

export default router;