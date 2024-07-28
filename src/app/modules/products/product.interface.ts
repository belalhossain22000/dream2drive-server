import { ObjectId } from 'mongodb'; // Import for clarity

// ProductImage
export interface ProductImage {
  image: string;
  imageType: string;
}

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
  productImages: any;
  productName: string;
  productImage: ProductImage[]; // Array of ProductImage (if using one-to-many)
  ProductDescription: string;
  auction: boolean;
  price: number;
  brandId: ObjectId;
  brand?: Brand;
  drivingPosition: string;
  ManufactureCountry: string;
  status: carStatusEnum;
  category: categoryEnum;
  createdAt: Date;
  updatedAt: Date;
}
