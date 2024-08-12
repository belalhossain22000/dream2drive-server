import { categoryEnum } from "@prisma/client";
import { ObjectId } from "mongodb"; // Import for clarity
import { number } from "zod";

// ProductImage
export interface TProductImage {
  image: string;
  imageType: string;
}

// Brand
export interface Brand {
  brandName: string;
  Products?: TProducts[]; // Array of Products (if using one-to-many)
}

// carStatusEnum (recommended for consistency
export enum carStatusEnum {
  pending = "pending",
  live = "live",
  sold = "sold",
}

// categoryEnum (recommended for consistency)
// export enum categoryEnum {
//   weeklyHighlights = "weeklyHighlights",
//   supercars = "supercars",
//   jdmLeagends = "jdmLeagends",
//   airCoooled = "airCoooled",
//   offRoadExplorer = "offRoadExplorer",
//   twoWheels = "twoWheels",
// }
// Products
export interface TProducts {
  productName: string;
  ProductDescription: string;
  auction: boolean;
  price: number;
  brandId: ObjectId;
  brand?: Brand;
  drivingPosition: "RHD" | "LHD";
  totalCarRun: number;
  gearType: " manual" | "auto";
  carMetal: string;
  leatherMaterial: string;
  carsInline: string;
  vin: string;
  lot: string;
  productSingleImage:string;
  productImage: string[];
  interiorImage: string[];
  exteriorImage: string[];
  othersImages: string[];
  auctionStartDate: string;
  auctionEndDate: string;
  ManufactureCountry: string;
  keyFacts: string;
  equipmentAndFeature: string;
  condition: string;
  serviceHistory: string;
  summary: string;
  status: carStatusEnum;
  category: categoryEnum;
  isDeleted?: boolean;
  createdAt: Date;
  updatedAt: Date;
}
