import express from 'express'
import { BiddingCotroller } from './bidding.controller';




const router = express.Router();

// task 3
router.post('/', BiddingCotroller.createBidding);
router.get('/', BiddingCotroller.getAllBidding);



export const biddingRoutes = router;