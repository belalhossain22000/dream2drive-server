import { ObjectId } from "mongodb";

export interface TBidding {
    bidPrice: number;
    productId: ObjectId;
    userId: ObjectId;

}