import express from 'express'
import validateRequest from '../../middlewares/validateRequest';
import { userController } from './user.controller';
const router = express.Router();

// task 3
router.post('/',userController.createAdmin);




export const userRoutes = router;