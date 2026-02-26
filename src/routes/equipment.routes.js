import express from 'express';
import * as equipmentController from '../controllers/equipment.controller.js';
import { verifyToken, verifyRole } from '../middlewares/auth.middleware.js';

const router = express.Router();

const authorizedRoles = ['HR', 'IT', 'OwnerBMU', 'Head'];

router.get('/', verifyToken, equipmentController.getAllEquipment);
router.get('/categories', verifyToken, equipmentController.getCategories);
router.get('/dashboard-summary', verifyToken, equipmentController.getDashboardSummary);

// Broken Equipment routes
router.post('/broken', verifyToken, equipmentController.reportBrokenEquipment);
router.get('/broken', verifyToken, equipmentController.getBrokenReports);
router.put('/broken/:id/resolve', verifyToken, verifyRole(authorizedRoles), equipmentController.resolveBrokenReport);

router.get('/:id', verifyToken, equipmentController.getEquipmentById);
router.post('/', verifyToken, verifyRole(authorizedRoles), equipmentController.createEquipment);
router.post('/bind', verifyToken, equipmentController.bindEquipment);
router.put('/:id/status', verifyToken, verifyRole(authorizedRoles), equipmentController.updateEquipmentStatus);
router.delete('/:id', verifyToken, verifyRole(authorizedRoles), equipmentController.deleteEquipment);

// Passwords per equipment
router.get('/:id/passwords', verifyToken, equipmentController.getEquipmentPasswords);
router.post('/:id/passwords', verifyToken, verifyRole(authorizedRoles), equipmentController.addEquipmentPassword);
router.delete('/passwords/:passwordId', verifyToken, verifyRole(authorizedRoles), equipmentController.deleteEquipmentPassword);

// Location toggle route
router.put('/:id/location', verifyToken, equipmentController.toggleLocation);

// Borrow History routes
router.get('/history/active', verifyToken, equipmentController.getActiveHistory);
router.post('/history/:id/borrow', verifyToken, equipmentController.borrowHistoryItem);
router.put('/history/:id/return', verifyToken, equipmentController.returnHistoryItem);

// Approval System routes
router.get('/history/pending', verifyToken, verifyRole(authorizedRoles), equipmentController.getPendingRequests);
router.put('/history/:id/approve', verifyToken, verifyRole(authorizedRoles), equipmentController.approveRequest);
router.put('/history/:id/reject', verifyToken, verifyRole(authorizedRoles), equipmentController.rejectRequest);

export default router;
