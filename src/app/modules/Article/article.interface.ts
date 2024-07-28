export interface TArticle {
    image: any;
    bannerImage: string;
    articleTitle: string;
    articleImages: ArticleImage[];
    published_by: string;
    published_Date: Date;
    viewed_by: number;
    description: string;
    userComment: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ArticleImage {
    image: string;
}
