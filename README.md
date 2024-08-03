# API Documentation

### API Documentation With Example : https://documenter.getpostman.com/view/27386605/2sA3kdByMX

## Table of Contents
- [Article Routes](#article-routes)
- [Auth Routes](#auth-routes)
- [Bidding Routes](#bidding-routes)
- [Brand Routes](#brand-routes)
- [Product Image Routes](#product-image-routes)
- [Product Routes](#product-routes)
- [Review Routes](#review-routes)
- [User Routes](#user-routes)
- [User Account Routes](#user-account-routes)
- [Wishlist Routes](#wishlist-routes)

## Article Routes
- **POST /articles**: Create a new article
- **GET /articles**: Retrieve all articles
- **GET /articles/:id**: Retrieve a single article by ID
- **PUT /articles/:id**: Update an article by ID
- **DELETE /articles/:id**: Delete an article by ID

## Auth Routes
- **POST /auth/login**: Login a user
- **POST /auth/register**: Register a new user
- **POST /auth/refresh-token**: Refresh JWT token

## Bidding Routes
- **POST /bidding**: Place a bid
- **GET /bidding**: Retrieve all bids
- **GET /bidding/:id**: Retrieve a single bid by ID
- **PUT /bidding/:id**: Update a bid by ID
- **DELETE /bidding/:id**: Delete a bid by ID

## Brand Routes
- **POST /brands**: Create a new brand
- **GET /brands**: Retrieve all brands
- **GET /brands/:id**: Retrieve a single brand by ID
- **PUT /brands/:id**: Update a brand by ID
- **DELETE /brands/:id**: Delete a brand by ID

## Product Image Routes
- **POST /product-images**: Upload a product image
- **GET /product-images**: Retrieve all product images
- **GET /product-images/:id**: Retrieve a single product image by ID
- **DELETE /product-images/:id**: Delete a product image by ID

## Product Routes
- **POST /products**: Create a new product
- **GET /products**: Retrieve all products
- **GET /products/:id**: Retrieve a single product by ID
- **PUT /products/:id**: Update a product by ID
- **DELETE /products/:id**: Delete a product by ID

## Review Routes
- **POST /reviews**: Create a new review
- **GET /reviews**: Retrieve all reviews
- **GET /reviews/:id**: Retrieve a single review by ID
- **PUT /reviews/:id**: Update a review by ID
- **DELETE /reviews/:id**: Delete a review by ID

## User Routes
- **POST /users**: Create a new user
- **POST /users/create-admin**: Create a new admin user
- **GET /users**: Retrieve all users
- **GET /users/:id**: Retrieve a single user by ID
- **PUT /users/:id**: Update a user by ID
- **DELETE /users/:id**: Delete a user by ID

## User Account Routes
- **GET /user-account**: Retrieve the account details of the logged-in user
- **PUT /user-account**: Update the account details of the logged-in user
- **DELETE /user-account**: Delete the account of the logged-in user
- **POST /user-account/bank-account**: Add a bank account for the user
- **POST /user-account/bank-account/verify**: Verify the user's bank account

## Wishlist Routes
- **POST /wishlist**: Add an item to the wishlist
- **GET /wishlist**: Retrieve all wishlist items
- **DELETE /wishlist/:id**: Remove an item from the wishlist by ID
