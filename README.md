# Book My Cinema 🎬

A full-stack web application for seamless cinema booking, built with a **Golang** backend and a **React.js** frontend.

## Project Structure

- **backend/** - Contains the server-side code in Golang, handling API requests for user registration, movie management, bookings, etc.
- **frontend/** - Frontend code in React.js for user interactions, providing a smooth booking experience.

## Features

### Backend (Golang)
- **User Authentication:** Registration, login, and admin authentication.
- **Booking Management:** Endpoints to create and manage bookings, check available seats, and cancel bookings.
- **City & Venue Management:** Admin functionalities to add cities and venues for movie screenings.
- **Movie Management:** CRUD operations for movies, show timings, and availability.

### Frontend (React.js)
- **User Interface:** Home page, movie listings, seat layout for booking, and payment confirmation.
- **Admin Panel:** Create movies, cities, venues, and manage bookings.
- **Profile Management:** User profiles with options for updating username and password.

## Installation

### Prerequisites
Ensure you have Golang, Node.js, and npm installed.

### Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Sushanth29/book-my-cinema.git
   cd book-my-cinema
   ```

2. **Backend Setup:**
   - Navigate to the backend folder:
     ```bash
     cd backend
     ```
   - Install dependencies and start the server:
     ```bash
     go mod download
     go run main.go
     ```
   - Backend server runs on `localhost:8080`.

3. **Frontend Setup:**
   - Open a new terminal, navigate to the `frontend` folder:
     ```bash
     cd ../frontend/src
     ```
   - Install dependencies and start the React app:
     ```bash
     npm install
     npm start
     ```
   - Frontend runs on `localhost:3000`.

## API Endpoints

### User
- **POST** `/register` - User registration.
- **POST** `/login` - User login.

### Admin
- **POST** `/admin-login` - Admin login.
- **POST** `/cities` - Add a new city.
- **POST** `/venues` - Add a new venue.

### Movies
- **GET** `/movies/upcoming` - Get a list of upcoming movies.
- **POST** `/movies/open/{movie_id}` - Open a movie for booking.
- **GET** `/movies/{movie_id}` - Get movie details by ID.

### Bookings
- **POST** `/bookings` - Create a booking.
- **GET** `/booked-seats/{venue_id}/{showtime}/{date}` - Get booked seats.
