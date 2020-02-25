import express from 'express';
import AdminService from './AdminService';

const router = express.Router();

const adminService = new AdminService();

router.get('/', adminService.get);
router.post('/', adminService.post);

export = router;