import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './WelcomePage.css';
import userIcon from './icons/user (1).png';

const WelcomePage = ({bodyClassName}) => {
    const [cities, setCities] = useState([]);
    const [movies, setMovies] = useState([]);
    const [selectedCity, setSelectedCity] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchCities();
    }, []);

    const fetchCities = async () => {
        try {
            const response = await axios.get('http://localhost:8080/cities');
            setCities(response.data);
        } catch (error) {
            console.error('Error fetching cities:', error);
        }
    };


    useEffect(() => {
        // Fetch movies when component mounts
        fetchOpenedMovies();
    }, [selectedCity]); // Fetch movies whenever selectedCity changes

    const fetchOpenedMovies = async () => {
        try {
            if (!selectedCity) {
                // If no city is selected, set movies to empty array
                setMovies([]);
                return;
            }

            // Fetch opened movies based on the selected city
            const response = await axios.get(`http://localhost:8080/movies/1?city_id=${selectedCity}`);
            setMovies(response.data);
        } catch (error) {
            console.error('Error fetching opened movies:', error);
            setError('Error fetching opened movies');
        }
    };

    const handleMovieClick = (movieId) => {
        window.location.href = `/movies/${movieId}`;
    };

    const handleCityChange = (event) => {
        // Update selectedCity state when city is selected
        setSelectedCity(event.target.value);
    };
    document.body.className = bodyClassName || '';

    return (
        <div className="user-welcome-container">
            <div className="top-center">
                <h2>Welcome to Book My Cinema!</h2>
            </div>
            <Link to="/profile" className="profile-link">
                    <div className="profile-icon"> {/* Styling for circle will be done in CSS */}
                        {/* You can place an icon or avatar here */}
                        <img src={userIcon} alt="Profile" />
                    </div>
                </Link>
            <div>
                <label  htmlFor="city">Select City:</label>
                <select className='label-css'id="city" value={selectedCity} onChange={handleCityChange}>
                    <option value="">Select</option>
                    {cities.map(city => (
                        <option key={city._id} value={city._id}>{city.city_name}</option>
                    ))}
                </select>
            </div>
            {error && <div className="error-message">{error}</div>}
            {movies.length === 0 ? (
                <div className="no-upcoming-movies">No upcoming movies available</div>
            ) : (
                <div className="user-movie-list-container">
                    {movies.map(movie => (
                        <div className="user-movie-item" key={movie._id} onClick={() => handleMovieClick(movie._id)}>
                            <Link to={`/movies/${movie._id}`}>
                                <div className="user-movie-poster">
                                    {movie.poster_url ? (
                                        <img src={movie.poster_url} alt={movie.name} />
                                    ) : (
                                        <div className="user-empty-poster">No Poster Available</div>
                                    )}
                                </div>
                                <div className="user-movie-name">{movie.name}</div>
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default WelcomePage;
