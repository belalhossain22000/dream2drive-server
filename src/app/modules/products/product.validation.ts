import { z } from 'zod';

const productImageSchema = z.object({
  body: z.object({
    id: z.string().optional(),
    image: z.string(),
    imageType: z.string(),
    productsId: z.string().optional()
  })
});



export const productValidationSchema = z.object({
  body: z.object({
    id: z.string(),
    productName: z.string(),
    productImage: z.array(productImageSchema),
    productSingleImage:z.string(),
    ProductDescription: z.string(),
    auction: z.boolean(),
    price: z.number().positive(),
    brandId: z.string(),
    drivingPosition: z.string(),
    keyFacts: z.string(),
    equipmentAndFeature: z.string(),
    condition: z.string(),
    serviceHistory: z.string(),
    summary: z.string(),
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
