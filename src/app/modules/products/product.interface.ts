import { Bidding, Brand, DrivingSide, ProductStatus, Review, Wishlist } from "@prisma/client";
import { ObjectId } from "mongodb";

// Enum for driving side
export enum DrivingSideEnum {
  LHD = "LHD",
  RHD = "RHD",
}

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
  drivingSide: DrivingSide; 
  color: string;
  interior: string;
  engine: string;
  sellerPhoneNumber:string; 
  sellerEmail: string; 
  sellerName: string; 
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

