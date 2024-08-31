import { Product, User } from "@prisma/client";


export interface Wishlist {
  id: string;
  userId: string;
  user: User;
  productId: string;
  product: Product;
  createdAt: Date;
}
