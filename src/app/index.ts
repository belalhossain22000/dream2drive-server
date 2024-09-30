import express from "express";
import { productRoutes } from "./modules/products/product.route";
import { userRoutes } from "./modules/User/user.route";
import { biddingRoutes } from "./modules/Bidding/bidding.route";
import { AuthRoutes } from "./modules/Autrh/auth.routes";
import { reviewRoutes } from "./modules/review/review.route";
import { wishlistRoute } from "./modules/wishlist/wishlist.route";
import { vehicleInfoRoutes } from "./modules/vehicleInfo/vehicleInfo.route";
import { vehicleSourcingRoutes } from "./modules/vehicleSourcing/vehicleSourcing.route";
import { paymentRoutes } from "./modules/payment/payment.route";
import { chatRoutes } from "./modules/chat/chat.route";
import { paymentInfoRoutes } from "./modules/paymentInfo/paymentInfo.route";
import { contactUsRoutes } from "./modules/contactUs/contactUs.route";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/products",
    route: productRoutes,
  },

  {
    path: "/biddings",
    route: biddingRoutes,
  },
  {
    path: "/users",
    route: userRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/reviews",
    route: reviewRoutes,
  },
  {
    path: "/wishlist",
    route: wishlistRoute,
  },
  {
    path: "/vehicleInfo",
    route: vehicleInfoRoutes,
  },
  {
    path: "/vehicle-sourcing",
    route: vehicleSourcingRoutes,
  },
  {
    path: "/create-payment-intent",
    route: paymentRoutes,
  },
  {
    path: "/chatroom",
    route: chatRoutes,
  },
  {
    path: "/paymentInfo",
    route: paymentInfoRoutes,
  },
  {
    path: "/contact-us",
    route: contactUsRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
