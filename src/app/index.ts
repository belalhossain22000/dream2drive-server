import express from 'express';
import { productRoutes } from './modules/products/product.route';
import { brandRoutes } from './modules/brands/brands.route';
import { userRoutes } from './modules/User/user.route';
import { biddingRoutes } from './modules/Bidding/bidding.route';
import { AuthRoutes } from './modules/Autrh/auth.routes';


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
        path: '/biddings',
        route: biddingRoutes
    },
    {
        path: '/users',
        route: userRoutes
    },
    {
        path: '/auth',
        route: AuthRoutes
    },
];

moduleRoutes.forEach(route => router.use(route.path, route.route))

export default router;