import express from 'express';
import { productRoutes } from './modules/products/product.route';
import { brandRoutes } from './modules/brands/brands.route';
import { userRoutes } from './modules/User/user.route';
import { articleRoutes } from './modules/Article/article.route';


const router = express.Router();

const moduleRoutes = [
    {
        path: '/products',
        route: productRoutes
    },
    {
        path: '/brands',
        route: brandRoutes
    },
    {
        path: '/auth/users',
        route: userRoutes
    },
];

moduleRoutes.forEach(route => router.use(route.path, route.route))

export default router;