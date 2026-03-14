## MERN BLOG
- WHATTPAD Type mern application where users can get wonderful content from various authors, create, read and enjoy!

> # Backend!

# MERN Blog Backend API

This repository contains the Express/MongoDB backend for the MERN blog application.

##  App Setup
1. Clone the repository and navigate to this folder.
2. Run `npm install` to install dependencies.
3. Configure your environment variables in a root `.env` file based on the required fields below.
4. Run `npm run dev` to start the development server.

##  Dependencies 
- express
- mongoose
- jsonwebtoken
- bcrypt
- dotenv
- cookie-parser

## Environment Variables
You need to provide the following variables in a `.env` file placed outside the `backend/` directory or appropriately referenced paths:
- `PORT` (e.g., 9110)
- `DB_ADDRESS` (MongoDB connection string)
- Note: JWT signing currently uses a hardcoded secret string `"chicken"`. Avoid doing this in production environments!

## Database Structure

### `User` Schema
- `firstName` (String, required)
- `lastName` (String)
- `email` (String, required, unique)
- `password` (String, required, hashed)
- `role` (Enum: `["USER", "AUTHOR", "ADMIN"]`, required)
- `profileImageUrl` (String)
- `isUserActive` (Boolean, default: `true`)

### `Article` Schema
- `author` (ObjectId referring to User, required)
- `title` (String, required)
- `category` (Enum: `["SMUT", "FICTION", "FANTASY", "BIO", "THRILLER", "EDU", "HORROR"]`, required)
- `content` (String, required)
- `comments` (Array of objects `{ user: ObjectId, comment: String }`)
- `isArticleActive` (Boolean, default: `true`)

## Endpoints Overview

All protected routes authenticate users through a JWT stored inside a secure generic `token` HTTP cookie.

### Common API (`/auth`)
- `POST /auth/register` - Create an account as either `USER` or `AUTHOR`.
- `POST /auth/login` - Authenticate with email/password and setup JWT token cookie.
- `GET /auth/logout` - Clear JWT HTTP cookie.

### User API (`/user-api`)
Requires `<USER>` Access Role.
- `GET /user-api/articles` - View all active articles sequentially.
- `GET /user-api/article/:id` - View a specific currently active article.
- `POST /user-api/comment/:articleId` - Post a comment into the nested comments array of an active article.

### Author API (`/author-api`)
Requires `<AUTHOR>` Access Role.
- `POST /author-api/article` - Publish a new article.
- `GET /author-api/articles` - View all written articles (active and inactive) associated with the author.
- `GET /author-api/article/:id` - Read a single article in fine detail.
- `PUT /author-api/article` - Edit parameters (title, content, etc.) of an authored article.
- `DELETE /author-api/article/:id` - Soft-delete an authored article (turns `isArticleActive` false).

### Admin API (`/admin-api`)
Requires `<ADMIN>` Access Role.
- `GET /admin-api/articles` - Complete overview of every article in the DB.
- `GET /admin-api/users` - View of all stored users containing basic details.
- `PATCH /admin-api/user-status/:id` - Toggle the active boolean state of a user in the system.
