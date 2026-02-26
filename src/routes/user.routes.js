import express from 'express';
import * as userController from '../controllers/user.controller.js';
import { verifyToken, verifyRole } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Only HR, IT, and OwnerBMU can manage users
const authorizedRoles = ['HR', 'IT', 'OwnerBMU', 'Head'];

router.get('/', verifyToken, verifyRole(authorizedRoles), userController.getAllUsers);
router.get('/:id', verifyToken, verifyRole(authorizedRoles), userController.getUserById);
router.post('/', verifyToken, verifyRole(authorizedRoles), userController.createUser);
router.put('/:id', verifyToken, verifyRole(authorizedRoles), userController.updateUser);
router.delete('/:id', verifyToken, verifyRole(authorizedRoles), userController.deleteUser);

export default router;
