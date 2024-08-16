import { Prisma } from "@prisma/client";

export const productsFilterableFields = [
  "searchTerm",
  "drivingSide",
  "status",
  "country",
  "brand"
];

export const productsSearchAbleFields: (keyof Prisma.ProductWhereInput)[] = [
  "productName",
  "keyFacts",
  "country",
  "color",
  "interior",
  "brand"
];
