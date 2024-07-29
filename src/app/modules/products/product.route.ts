import express from 'express'
import { productCotroller } from './product.controller';
import validateRequest from '../../middlewares/validateRequest';
import { productValidation } from './product.validation';



const router = express.Router();

// task 3
router.post('/', productCotroller.createProduct);
router.get('/', productCotroller.getAllProduct);
router.get('/:id', productCotroller.getSingleProduct);
router.put('/:id', productCotroller.updateProduct);
router.delete('/:id', productCotroller.deleteProduct);



export const productRoutes = router;