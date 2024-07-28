import { z } from 'zod';

const productImageSchema = z.object({
  id: z.string(),
  image: z.string(),
  imageType: z.string(),
  productsId: z.string().optional()
});

const brandSchema = z.object({
  id: z.string(),
  brandName: z.string(),
});

export const productValidationSchema = z.object({
  body: z.object({
    id: z.string(),
    productName: z.string(),
    productImage: z.array(productImageSchema),
    ProductDescription: z.string(),
    auction: z.boolean(),
    price: z.number().positive(),
    brandId: z.string(),
    drivingPosition: z.string(),
    ManufactureCountry: z.string(),
    status: z.enum(['pending', 'live', 'sold']),
    category: z.enum(['weeklyHighlights', 'supercars', 'jdmLeagends', 'airCoooled', 'offRoadExplorer', 'twoWheels']),
    createdAt: z.date(),
    updatedAt: z.date(),
  })
})
export const productValidation = {
  productValidationSchema
}
