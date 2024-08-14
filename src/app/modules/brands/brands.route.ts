import express from 'express'
import validateRequest from '../../middlewares/validateRequest';
import { brandValidation } from './brands.validation';
import { brandController } from './brands.controller';

const router = express.Router();

// crate a brands
router.post('/', validateRequest(brandValidation.BrandValidationSchema),brandController.createBrand);

// get all brands
router.get('/',  brandController.getAllBrands);



export const brandRoutes = router;