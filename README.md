PeakNest — Himalayan Hotel Booking Platform

A full-stack hotel booking website for Himalayan destinations (Shimla, Manali, Dharamshala, Kasol, Spiti Valley). It includes a public site for browsing hotels and rooms, role-based login for guests and admins, and an admin dashboard for managing users and hotels.

Features
Browse destinations, hotels, rooms, deals, and testimonials
Hotel detail pages with galleries, amenities, and pricing
Guest signup and login
Role-based authentication (admin / user) using JWT and session storage
Protected admin routes through role-checking middleware
Admin dashboard with user stats, user list, and hotel management
Hotel API supporting create, read, update, and delete, backed by MongoDB
Admin account auto-seeded from environment variables on first start
Tech Stack
Backend: Node.js, Express.js
Database: MongoDB, Mongoose
Auth: JWT, express-session, connect-mongo, bcryptjs
Frontend: EJS templates, HTML, CSS, JavaScript
Project Structure
peakNest/
├── config/          # db connection, admin seeding
├── controller/      # auth, dashboard stats, hotel CRUD logic
├── middleware/      # body parser, admin role check
├── models/          # User and Hotel schemas
├── routes/          # page and API routes
├── public/          # css, images, static data
├── views/           # EJS pages and partials
└── server.js        # entry point
Getting Started
Prerequisites
Node.js (v18 or later)
MongoDB running locally, or a MongoDB Atlas connection string
Installation
bash
git clone https://github.com/<your-username>/peaknest.git
cd peaknest
npm install
Environment Variables

Create a .env file in the project root (see .env.example):

env
MONGO_URI=mongodb://127.0.0.1:27017/peaknest
JWT_SECRET=your_jwt_secret_here
PORT=3000
ADMIN_FULLNAME=Admin Name
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_admin_password
Run the App
bash
npm start        # run normally
npm run dev      # run with nodemon (auto-reload)

The server starts at http://localhost:3000.

Pages
URL	Description
/	Homepage
/hotel/:id	Hotel details
/login	Guest login
/signup	Create an account
/admin/login	Admin login
/admin/dashboard	Admin dashboard (admin only)
API Endpoints
Method	Endpoint	Access	Description
POST	/api/auth/register	Public	Register a user
POST	/api/auth/login	Public	Log in and receive a token
GET	/api/auth/logout	Public	Log out and destroy the session
GET	/api/auth/dashboard-stats	Admin	User statistics
GET	/api/auth/all-users	Admin	List all users
GET	/api/auth/hotels	Admin	List hotels
POST	/api/auth/hotels	Admin	Add a hotel
PUT	/api/auth/hotels/:id	Admin	Update a hotel
DELETE	/api/auth/hotels/:id	Admin	Delete a hotel
Admin Access

On first start, the server creates an admin account using ADMIN_EMAIL and ADMIN_PASSWORD from your .env. Log in at /admin/login with those credentials.

License

ISC
