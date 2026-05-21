# Blog App

Full-stack MERN blog application with separate frontend and backend projects. Users can read articles and comment, authors can manage their own articles, and admins can manage user access.

Repository: [prathibhachirra/blog-app](https://github.com/prathibhachirra/blog-app)

## Project Structure

```text
Capstone-Project--Blog-App/
|-- Blog-Frontend/
|   `-- React + Vite client application
|-- Blog-Backend/
|   `-- Express + MongoDB REST API
`-- README.md
```

## Features

- Role-based authentication for users, authors, and admins
- User and author registration
- Profile image upload with Cloudinary
- Article creation, editing, soft deletion, and restoration
- Article reading and commenting
- Protected frontend routes based on user role
- Admin block and unblock controls

## Tech Stack

### Frontend

- React
- Vite
- React Router
- Zustand
- Axios
- React Hook Form
- Tailwind CSS

### Backend

- Node.js
- Express
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Multer
- Cloudinary

## Prerequisites

- Node.js 18 or later
- npm
- MongoDB database
- Cloudinary account

## Getting Started

Clone the repository:

```bash
git clone https://github.com/prathibhachirra/blog-app.git
cd blog-app
```

Install backend dependencies:

```bash
cd Blog-Backend
npm install
```

Create `Blog-Backend/.env`:

```env
PORT=5000
mongodb=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
```

Start the backend:

```bash
npm start
```

Open a new terminal and install frontend dependencies:

```bash
cd Blog-Frontend
npm install
```

Create `Blog-Frontend/.env`:

```env
VITE_API_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

Backend URL:

```text
http://localhost:5000
```

## Important Notes

- The backend uses cookies for authentication, so frontend requests must include credentials.
- The backend CORS origin must match the frontend URL.
- For local development, configure CORS to allow `http://localhost:5173`.
- Keep `.env` files private and never commit secrets.

## Documentation

- Frontend documentation: [`Blog-Frontend/README.md`](./Blog-Frontend/README.md)
- Backend documentation: [`Blog-Backend/README.md`](./Blog-Backend/README.md)

## Deployment

Deploy the frontend and backend separately.

1. Deploy the backend to a Node.js hosting platform and add all backend environment variables.
2. Update backend CORS to allow the deployed frontend URL.
3. Deploy the frontend with `VITE_API_URL` set to the deployed backend URL.
4. Verify login, registration, article creation, and comments after deployment.
