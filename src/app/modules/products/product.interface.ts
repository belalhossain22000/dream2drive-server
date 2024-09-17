import { Bidding, Brand, ProductStatus, Review, Wishlist } from "@prisma/client";
import { ObjectId } from "mongodb";



// Enum for product status
export enum ProductStatusEnum {
  comingSoon = "comingSoon",
  live = "live",
  sold = "sold",
  unsold = "unsold",
}

export interface TProducts {
  id: string;
  productName: string;
  singleImage: string;
  region: string;
  userId:string
  keyFacts: string;
  equepmentAndFeature: string;
  condition: string;
  serviceHistory: string;
  summary: string;
  youtubeVideo: string;
  galleryImage: any[];
  auctionStartDate: Date;
  auctionEndDate: Date;
  brandId: string;
  brand: Brand; 
  speed: number;
  price: number;
  gear: string;
  color: string;
  interior: string;
  engine: string;
  sellerPhoneNumber:string; 
  sellerEmail: string; 
  sellerName: string; 
  sellerUserName: string;
  vin: string;
  country: string;
  lotNumbers: string;
  isDeleted: boolean;
  featured: boolean;
  status: ProductStatus; 
  wishlist: Wishlist[]; 
  reviews: Review[]; 
  biddings: Bidding[]; 
  createdAt: Date;
  updatedAt: Date;
}

