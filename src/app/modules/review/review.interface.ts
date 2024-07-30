import { Products, User } from "@prisma/client";

export interface Review {
    id: string;
    userId: string; 
    productId: string; 
    rating: number; 
    comment?: string;
    createdAt: Date; 
    updatedAt: Date; 
    user?: User; 
    product?: Products; 
  }