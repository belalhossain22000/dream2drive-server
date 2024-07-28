import { z } from "zod";

const biddingValidationData = z.object({
    bidPrice: z.number(),
    productId: z.string(),
    userId: z.string()
})