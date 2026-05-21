# Blog App Backend

Express and MongoDB backend for the Blog App capstone project. It handles authentication, role-based API access, article management, comments, profile image uploads, and admin user controls.

## Features

- Register users and authors
- Login and logout with JWT stored in an HTTP-only cookie
- Role-based protected routes for `USER`, `AUTHOR`, and `ADMIN`
- Create, read, update, soft-delete, and restore articles
- Add comments to active articles
- Upload profile images to Cloudinary
- Block and unblock users from the admin API
- MongoDB schemas with Mongoose validation

## Tech Stack

- Node.js
- Express 5
- MongoDB
- Mongoose
- JSON Web Token
- bcryptjs
- Multer
- Cloudinary
- cookie-parser
- CORS
- dotenv

## Folder Structure

```text
Blog-Backend/
|-- APIs/
|   |-- AdminApi.js
|   |-- AuthorApi.js
|   |-- CommonApi.js
|   `-- UserApi.js
|-- config/
|   |-- cloudinary.js
|   |-- cloudinaryUpload.js
|   `-- multer.js
|-- middlewares/
|   |-- checkAuthor.js
|   `-- verifyToken.js
|-- models/
|   |-- ArticleModel.js
|   `-- UserTypeModel.js
|-- services/
|   `-- authservice.js
|-- package.json
|-- req.http
|-- server.js
`-- README.md
```

## Prerequisites

- Node.js 18 or later
- npm
- MongoDB database connection string
- Cloudinary account for image uploads

## Environment Variables

Create a `.env` file inside `Blog-Backend`:

```env
PORT=5000
mongodb=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
```

Keep `.env` private and do not commit it to GitHub.

## Installation

```bash
npm install
```

## Run Locally

```bash
npm start
```

The server runs at:

```text
http://localhost:5000
```

## API Overview

### Common API

Base path: `/common-api`

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/login` | Login user, author, or admin |
| `GET` | `/logout` | Clear auth cookie |
| `PUT` | `/passwordChange` | Change password for an authenticated user |
| `GET` | `/check-auth` | Verify logged-in user from cookie |

### User API

Base path: `/user-api`

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/users` | Register a new user |
| `GET` | `/users` | Get active users |
| `GET` | `/articles` | Get active articles, protected for `USER` |
| `PUT` | `/articles` | Add a comment to an article, protected for `USER` |

### Author API

Base path: `/author-api`

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/users` | Register a new author |
| `POST` | `/articles` | Create an article, protected for `AUTHOR` |
| `GET` | `/articles/by-id/:id` | Get one article by id |
| `GET` | `/articles/:authorId` | Get articles written by an author |
| `GET` | `/articles` | Get all articles |
| `PUT` | `/articles` | Edit an article, protected for `AUTHOR` |
| `PATCH` | `/articles/:id/status` | Soft-delete or restore an article |

### Admin API

Base path: `/admin-api`

| Method | Endpoint | Description |
| --- | --- | --- |
| `PUT` | `/blockUsers/:uid` | Block a user |
| `PUT` | `/UnblockUsers/:uid` | Unblock a user |

## Data Models

### User

- `firstName`
- `lastName`
- `email`
- `password`
- `ProfileImageUrl`
- `role`: `USER`, `AUTHOR`, or `ADMIN`
- `isActive`

### Article

- `author`
- `title`
- `category`
- `content`
- `comments`
- `isArticleActive`
- timestamps

## CORS

The backend currently allows requests from the deployed frontend URL configured in `server.js`. For local frontend development, update the CORS origin to include `http://localhost:5173` or use an environment-based CORS configuration.

## Deployment

1. Add all environment variables to the backend hosting platform.
2. Set the frontend URL in CORS.
3. Run `npm install`.
4. Start the server with `npm start`.

Render, Railway, or similar Node.js hosting platforms can run this backend.
