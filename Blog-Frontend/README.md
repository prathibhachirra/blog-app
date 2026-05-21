# Blog App Frontend

React frontend for the Blog App capstone project. It provides role-based dashboards for users, authors, and admins, and connects to the Express backend through REST APIs.

## Features

- User and author registration with profile image upload
- Login and logout using backend authentication cookies
- Protected routes for user and author dashboards
- User dashboard for reading articles and adding comments
- Author dashboard for creating, editing, deleting, and restoring articles
- Admin dashboard route for administration features
- Toast notifications and error boundary handling

## Tech Stack

- React 19
- Vite
- React Router
- Zustand
- Axios
- React Hook Form
- React Hot Toast
- Tailwind CSS
- ESLint

## Folder Structure

```text
Blog-Frontend/
|-- public/
|-- src/
|   |-- assets/
|   |-- components/
|   |-- store/
|   |-- styles/
|   |-- App.jsx
|   |-- App.css
|   |-- index.css
|   `-- main.jsx
|-- eslint.config.js
|-- index.html
|-- package.json
|-- vite.config.js
`-- README.md
```

## Prerequisites

- Node.js 18 or later
- npm
- Running Blog App backend

## Environment Variables

Create a `.env` file inside `Blog-Frontend`:

```env
VITE_API_URL=http://localhost:5000
```

For production, set `VITE_API_URL` to the deployed backend URL.

## Installation

```bash
npm install
```

## Run Locally

```bash
npm run dev
```

The Vite development server usually runs at:

```text
http://localhost:5173
```

## Available Scripts

```bash
npm run dev
```

Starts the frontend development server.

```bash
npm run build
```

Creates a production build.

```bash
npm run preview
```

Serves the production build locally.

```bash
npm run lint
```

Runs ESLint checks.

## Main Routes

| Route | Description |
| --- | --- |
| `/home` | Public home page |
| `/register` | Register as user or author |
| `/login` | Login page |
| `/user-dashboard` | User-only article dashboard |
| `/author-dashboard` | Author-only article dashboard |
| `/add-article` | Author-only create article page |
| `/admin-dashboard` | Admin dashboard |
| `/article/:id` | Article details page |
| `/article/:id/edit` | Author-only edit article page |
| `/unauthorized` | Unauthorized access page |

## Backend Connection

All API requests use:

```js
import.meta.env.VITE_API_URL
```

Make sure the backend is running and CORS is configured to allow the frontend origin.

## Deployment

1. Set `VITE_API_URL` in the hosting platform.
2. Run `npm run build`.
3. Deploy the generated `dist/` folder.

Vercel or Netlify are good options for this frontend.
