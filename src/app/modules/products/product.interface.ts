import { ObjectId } from 'mongodb'; // Import for clarity


// export interface TProductImage {
//   image: string;
//   imageType: string;
// }

// Brand
export interface Brand {
  brandName: string;
  Products?: TProducts[]; // Array of Products (if using one-to-many)
}

// carStatusEnum (recommended for consistency)
export enum carStatusEnum {
  pending = 'pending',
  live = 'live',
  sold = 'sold',
}

// categoryEnum (recommended for consistency)
export enum categoryEnum {
  weeklyHighlights = 'weeklyHighlights',
  supercars = 'supercars',
  jdmLeagends = 'jdmLeagends',
  airCoooled = 'airCoooled',
  offRoadExplorer = 'offRoadExplorer',
  twoWheels = 'twoWheels',
}

// Products
export interface TProducts {
  productName: string;
  productImage: any; // Array of ProductImage (if using one-to-many)
  ProductDescription: string;
  auction: boolean;
  price: number;
  brandId: ObjectId;
  brand?: Brand;
  auctionStartDate: string;
  auctionEndDate: string;
  drivingPosition: string;
  ManufactureCountry: string;
  status: carStatusEnum;
  category: categoryEnum;
  createdAt: Date;
  updatedAt: Date;
  isDeleted?: boolean;
}
