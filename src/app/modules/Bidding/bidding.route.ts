import express from 'express'
import { BiddingCotroller } from './bidding.controller';




const router = express.Router();
// bidding
router.post('/', BiddingCotroller.createBidding);
router.get('/', BiddingCotroller.getAllBidding);
router.get('/:id', BiddingCotroller.getSingleBidding);



export const biddingRoutes = router;