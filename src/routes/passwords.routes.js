import express from 'express';
import * as passwordController from '../controllers/passwords.controller.js';
import { verifyToken, verifyRole } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(verifyToken);
router.use(verifyRole(['IT', 'OwnerBMU']));

router.get('/', passwordController.getAllPasswords);
router.post('/', passwordController.createPassword);
router.put('/:id', passwordController.updatePassword);
router.delete('/:id', passwordController.deletePassword);

export default router;
