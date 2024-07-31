import { Products, User } from "@prisma/client";


export interface Wishlist {
  id: string;
  userId: string;
  user: User;
  productId: string;
  product: Products;
  createdAt: Date;
}
