BlogApp Backend
---------------

•This is the backend part of BlogApp developed using Node.js, Express.js and MongoDB.
•Backend handles authentication, database operations, REST APIs, blog management and file uploads.

1. Generate package.json
npm init -y
Add "type":"module" in package.json for using import/export syntax.

2. Create server.js
server.js is the entry point of backend application.

3. Install Express and Create HTTP Server
npm i express

Express is used to create server and REST APIs.

4. Create .gitignore File

Used to ignore unnecessary files like:
node_modules/
.env

5. Create .env File
Used to store sensitive data securely.

Example:
PORT=5000
MONGO_URI=your_mongodb_url
JWT_SECRET=your_secret_key

•Install dotenv:
npm i dotenv
Sensitive data should not be pushed to GitHub repository.

•Connect MongoDB Database
MongoDB Connection Flow
REST API → Mongoose (ODM Tool) → MongoDB Server

•Mongoose is an ODM tool used for:

Schema Design
Validation
Database Operations

•Steps
a. Install Mongoose
npm i mongoose
b. Create Schema
Schema acts as blueprint of document and validates request data.
c. Create Model
Model is created using schema.
d. Perform Database Operations
Operations performed:
Insert Data
Update Data
Delete Data
Fetch Data
Middlewares Used
Express JSON Middleware
Error Handling Middleware
JWT Verification Middleware

•Middleware works between request and response.

•Authentication
JWT Authentication is implemented for protected routes.

Features:
User Login
Token Generation
Token Verification
Protected Routes

•Public routes do not require token verification.

REST APIs
--------

•REST APIs are created for:

User Registration
Login
Blog CRUD Operations
Comments
File Uploads

•Multer and Cloudinary are used for image uploads.

Flow:

Client → Backend → Cloudinary → Database

•Only image URLs are stored in MongoDB.

•Project Structure
Blog-Backend/
│
├── APIs/
├── config/
├── middlewares/
├── models/
├── services/
│
├── .gitignore
├── README.md
├── package.json
├── package-lock.json
├── req.http
└── server.js


•Install dependencies:
npm install

•Run Backend Server
npm run dev

•Server runs on:
http://localhost:5000
