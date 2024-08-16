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
  userId:string
  keyFacts: string;
  equepmentAndFeature: string;
  condition: string;
  serviceHistory: string;
  summary: string;
  youtubeVideo: string;
  galleryImage: any[]; // Json[] in Prisma can be represented as any[] in TypeScript
  exteriorImage: any[];
  interiorImage: any[];
  othersImage: any[];
  auctionStartDate: Date;
  auctionEndDate: Date;
  brandId: string;
  brand: Brand; // Assuming Brand is another interface defined for the Brand model
  speed: number;
  price: number;
  gear: string;
  drivingSide: DrivingSide; // Assuming DrivingSide is an enum
  color: string;
  interior: string;
  engine: string;
  vin: string;
  country: string;
  isDeleted: boolean;
  featured: boolean;
  status: ProductStatus; // Assuming ProductStatus is an enum
  wishlist: Wishlist[]; // Assuming Wishlist is another interface defined for the Wishlist model
  reviews: Review[]; // Assuming Review is another interface defined for the Review model
  biddings: Bidding[]; // Assuming Bidding is another interface defined for the Bidding model
  createdAt: Date;
  updatedAt: Date;
}

