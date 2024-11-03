import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SelectVenue from './SelectVenue'; 
import './OpenMovies.css';


const OpenMoviesPage = ({bodyClassName}) => {
    const [upcomingMovies, setUpcomingMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [selectedMovie, setSelectedMovie] = useState(null); // State to track the selected movie

    useEffect(() => {
        const fetchUpcomingMovies = async () => {
            try {
                const response = await axios.get('http://13.53.132.117:8080/movies/upcoming');
                setUpcomingMovies(response.data);
            } catch (error) {
                setError('Error fetching upcoming movies');
            } finally {
                setIsLoading(false);
            }
        };
        fetchUpcomingMovies();
    }, []);

    const handleOpenMovie = (movieId) => {
        setSelectedMovie(movieId); // Set the selected movie when the admin clicks "Open"
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    document.body.className = bodyClassName || ''

    return (
        <div className="welcome-container">
            <div className="top-center">
                <h2>Upcoming Movies</h2>
            </div>

            <div className="movie-list-container">
                {successMessage && <div>{successMessage}</div>}
                {selectedMovie ? (
                    // Render SelectVenue component if a movie is selected
                    <SelectVenue movieId={selectedMovie} />
                ) : (
                    upcomingMovies && upcomingMovies.length > 0 ? (
                        upcomingMovies.map(movie => (
                            <div key={movie._id} className="movie-item">
                                <div className="movie-poster">
                                    <img src={movie.poster_url} alt={movie.name} />
                                </div>
                                <div className="movie-name">{movie.name}</div>
                                <button className='open-btn' onClick={() => handleOpenMovie(movie._id)}>Open</button>
                            </div>
                        ))
                    ) : (
                        <p>No upcoming movies</p>
                    )
                )}
            </div>
        </div>
    );
};

export default OpenMoviesPage;
