# QuickShow - Full Stack Movie Ticket Booking Platform

QuickShow is a full-stack movie ticket booking platform that allows users to browse movies, select show timings, book seats, manage favorites, and securely complete payments.

## Live Demo

https://YOUR-VERCEL-URL.vercel.app

## GitHub Repository

https://github.com/manaswi017/quickShow

---

## Features

### User Features

* Browse available movies and show timings
* View movie details and trailers
* Add/remove movies from favorites
* Secure user authentication with Clerk
* Book movie tickets online
* View booking history
* Responsive UI for desktop and mobile devices

### Admin Features

* Add and manage movie shows
* Monitor bookings
* Manage platform content

### Payment Integration

* Secure payments using Stripe

---

## Tech Stack

### Frontend

* React.js
* React Router
* Tailwind CSS
* Axios

### Backend

* Node.js
* Express.js

### Database

* MongoDB Atlas
* Mongoose

### Authentication

* Clerk

### Third-Party APIs

* TMDB API (Movie Data)
* Stripe API (Payments)

### Deployment

* Frontend: Vercel
* Backend: Render

---

## Screenshots

Add screenshots of:

* Home Page
* Movie Listing Page
* Movie Details Page
* Booking Page
* Admin Dashboard

---

## Installation & Setup

### Clone Repository

```bash
git clone https://github.com/manaswi017/quickShow.git
cd quickShow
```

### Backend Setup

```bash
cd server
npm install
```

Create a `.env` file and add:

```env
MONGODB_URI=
CLERK_SECRET_KEY=
TMDB_API_KEY=
STRIPE_SECRET_KEY=
```

Run backend:

```bash
npm start
```

### Frontend Setup

```bash
cd client
npm install
```

Create a `.env` file and add:

```env
VITE_BASE_URL=
VITE_CLERK_PUBLISHABLE_KEY=
VITE_CURRENCY=$
```

Run frontend:

```bash
npm run dev
```

---

## Future Improvements

* Real-time seat availability
* Movie recommendations
* Email booking confirmations
* Advanced analytics dashboard
* Coupon and discount system

---

## Author

Manaswi Shinde


GitHub: https://github.com/manaswi017
