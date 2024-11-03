import React from 'react';
import { Link } from 'react-router-dom';
import cinemaIcon1 from './icons/cinema.png';
import cinemaIcon2 from './icons/movies.png';
import movieIcon from './icons/theatre.png';
import './Homepage.css';

const HomePage = ({bodyClassName}) => {
    document.body.className = bodyClassName || ''
    return (
        <div className="container">
            <h1>
                <span className="website-name">Book My Cinema</span>
            </h1>
            <div className="virtual-box">
                <h2 className='welcome-text'>Welcome to Movie Booking</h2>
                <div className="button-group">
                    <Link to="/register" className="button">
                        Register
                    </Link>
                    <Link to="/login" className="button">
                        Login
                    </Link>
                    <Link to="/admin-login" className="button">
                        Login as Admin
                    </Link>
                </div>
                <div className="icon-row">
                    <img src={cinemaIcon1} alt="Cinema Icon 1" className="icon" />
                    <img src={cinemaIcon2} alt="Cinema Icon 2" className="icon" />
                    <img src={movieIcon} alt="Movie Icon" className="icon" />
                </div>
            </div>
        </div>
    );
};

export default HomePage;
