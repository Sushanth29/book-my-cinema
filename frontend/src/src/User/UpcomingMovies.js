import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import './UpcomingMovies.css'; // Import the CSS file for styling

const UpcomingMovies = () => {
    const [upcomingMovies, setUpcomingMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUpcomingMovies = async () => {
            try {
                const response = await axios.get('http://localhost:8080/movies/upcoming');
                setUpcomingMovies(response.data);
            } catch (error) {
                setError('Error fetching upcoming movies');
            } finally {
                setIsLoading(false);
            }
        };
        fetchUpcomingMovies();
    }, []);

    const handleMovieClick = (movieId) => {
        window.location.href = `/movies/${movieId}`;
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="welcome-container">
            <h2>Book My Cinema</h2>
            <div className="upcoming-movies-container"> 
                <h3 className="title">Upcoming Movies</h3> 
                <div className="movie-list"> 
                    {upcomingMovies.map(movie => (
                        <div className="movie-item" key={movie._id} onClick={() => handleMovieClick(movie._id)}>
                        <Link to={`/movies/${movie._id}`}>
                            <div className="movie-poster">
                                {movie.poster_url ? (
                                    <img src={movie.poster_url} alt={movie.name} />
                                ) : (
                                    <div className="empty-poster">No Poster Available</div>
                                )}
                            </div>
                            <div className="movie-name">{movie.name}</div>
                        </Link>
                    </div>
                    ))}
                </div>
                {upcomingMovies.length === 0 && <p className="no-movies-msg">No upcoming movies</p>}
            </div>
        </div>
    );
};

export default UpcomingMovies;
