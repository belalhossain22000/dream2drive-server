import express from 'express'
import { ArticleController } from './article.controller';


const router = express.Router();

// task 3
router.post('/', ArticleController.createArticle);
router.get('/', ArticleController.getAllArticles);



export const articleRoutes = router;