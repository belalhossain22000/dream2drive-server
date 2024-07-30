import express from 'express'
import { productCotroller } from './product.controller';
import { fileUploader } from '../../../helpars/fileUploader';



const router = express.Router();

// task 3
router.post('/',fileUploader.uploadMultiple, productCotroller.createProduct);
router.get('/', productCotroller.getAllProduct);
router.get('/featured', productCotroller.getFeaturedProduct);
router.get('/:id', productCotroller.getSingleProduct);
router.put('/:id', productCotroller.updateProduct);
router.put('/create-featured/:id', productCotroller.createFeaturedProduct);
router.delete('/:id', productCotroller.deleteProduct);



export const productRoutes = router;