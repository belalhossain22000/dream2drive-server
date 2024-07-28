import express from 'express'
import validateRequest from '../../middlewares/validateRequest';
import { brandValidation } from './brands.validation';
import { brandController } from './brands.controller';

const router = express.Router();

// task 3
router.post('/', validateRequest(brandValidation.BrandValidationSchema),brandController.createBrand);
router.get('/',  brandController.getAllBrands);



export const brandRoutes = router;