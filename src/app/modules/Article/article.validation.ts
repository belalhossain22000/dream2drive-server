// src/schemas/article.schema.ts
import { z } from 'zod';
export const ArticleImageSchema = z.object({
    body: z.object({
        image: z.string(),

    })
});

export const ArticleValidationSchema = z.object({
    body: z.object({
        bannerImage: z.string().min(1, "Banner image URL is required"),
        articleImages: z.array(ArticleImageSchema),
        articleTitle: z.string(),
        published_by: z.string().min(1, "Publisher name is required"),
        published_Date: z.date(),
        viewed_by: z.number().int().nonnegative(),
        description: z.string().min(1, "Description is required"),
        userComment: z.string()
    })
});
export const articleValdation = {
    ArticleValidationSchema
}