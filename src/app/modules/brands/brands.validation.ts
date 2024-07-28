import { z } from 'zod';

export const BrandValidationSchema = z.object({
    body: z.object({
        _id: z.string().optional(),
        brandName: z.string(),
    })
});

export const brandValidation = {
    BrandValidationSchema
}
