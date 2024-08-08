import express from 'express'
import validateRequest from '../../middlewares/validateRequest';
import { ContactInfoController } from './contactInfo.controller';
import { contactValidation } from './contactInfo.validation';


const router = express.Router();

// task 3
router.post('/', validateRequest(contactValidation.contactInfoSchema),ContactInfoController.createContactInfo);
router.get('/', ContactInfoController.getAllContactInfos);



export const contactInfoRoutes = router;