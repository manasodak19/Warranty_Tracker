# Warranty Tracker

A simple MERN application for managing product warranties and tracking upcoming expiry dates.

## Requirements

- Node.js 18 or newer
- MongoDB running locally, or a MongoDB connection string

## Setup

1. Install backend dependencies:

   ```sh
   cd server
   npm install
   ```

2. Copy `server/.env.example` to `server/.env` and set `MONGODB_URI` and a long, random `JWT_SECRET`.
3. Install frontend dependencies:

   ```sh
   cd ../client
   npm install
   ```

4. From the project root, start the API and frontend in separate terminals:

   ```sh
   npm run dev:server
   npm run dev:client
   ```

5. Open the Vite URL printed in the client terminal (normally `http://localhost:5173`).

The Vite development server proxies `/api` requests to `http://localhost:5000`. For a deployed frontend, set `VITE_API_URL` to the backend API base URL including `/api` (for example, `https://api.example.com/api`) and configure the backend's `FRONTEND_URL` to the frontend origin. The API uses an httpOnly JWT cookie; production deployments must use HTTPS.

## Build and run

From the project root, `npm run build` creates the production frontend bundle in `client/dist`. Set the backend environment variables and run `npm start` from the root to start the API.

Run `npm test` from the project root to verify backend date validation, calendar-month expiry calculations, and frontend warranty status boundaries.

## Features

- Registration and login with bcrypt password hashing and JWT cookie authentication
- User-scoped product create, read, update, and delete operations
- Calendar-based warranty expiry calculation using date-only values
- Dashboard counts, expiry status, searching, filtering, and sorting
- Responsive plain-CSS interface
