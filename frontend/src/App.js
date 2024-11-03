import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './User/HomePage';
import RegisterForm from './User/RegisterForm';
import LoginForm from './User/LoginForm';
import WelcomePage from './User/WelcomePage';
import AdminWelcomePage from './Admin/WelcomePage';
import AdminLoginForm from './Admin/LoginForm';
import CreateCity from './Admin/CreateCity';
import CreateVenue from './Admin/CreateVenue'
import CreateMovie from './Admin/CreateMovie';
import OpenMovies from './Admin/OpenMovies';
import UpcomingMovies from './User/UpcomingMovies';
import MovieDetailsPage from './User/MovieDetailsPage';
import SeatLayout from './User/SeatLayout';
import CartPage from './User/CartPage';
import ConfirmationPage from './User/ConfirmationPage';
import Profile from './User/Profile';
import TicketSplitter from './User/SplitTickets';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home  bodyClassName="home-body"/>} />
                <Route path="/register" element={<RegisterForm bodyClassName="login-form-body" />} />
                <Route path="/login" element={<LoginForm bodyClassName="login-form-body" />} />
                <Route path="/welcome" element={<WelcomePage bodyClassName="login-form-body" />} />
                <Route path="/welcome-admin" element={<AdminWelcomePage bodyClassName="welcome-form-body"  />} />
                <Route path="/admin-login" element={<AdminLoginForm bodyClassName="login-form-body"/>} />
                <Route path="/admin/create-city" element={<CreateCity />} />
                <Route path="/admin/create-venue" element={<CreateVenue />} />
                <Route path="/admin/create-movie" element={<CreateMovie />} />
                <Route path="/admin/open-movies" element={<OpenMovies bodyClassName="open-movies-body"/>} />
                <Route path="/movies/upcoming" element={<UpcomingMovies />} />
                <Route path="/movies/:id" element={<MovieDetailsPage bodyClassName="login-form-body" />} />
                <Route path="/seatlayout" element={<SeatLayout  bodyClassName="seat-form-body"/>} />
                <Route path="/cart" element={<CartPage  bodyClassName="login-form-body"/>} />
                <Route path="/confirmation" element={<ConfirmationPage  bodyClassName="login-form-body"/>} />
                <Route path='/profile' element={<Profile  bodyClassName="seat-form-body"/>} />
                <Route path='/split-tickets' element={<TicketSplitter />} />
            </Routes>
        </Router>
    );
};

export default App;
