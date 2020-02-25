import express from 'express';
import participantService from '../../participant';

const router = express.Router();

router.get('/', participantService.getGroupedByDepartment);
router.get('/data', participantService.getGroupedByDepartmentData);

export = router;