import React, { useState } from 'react';
import axios from 'axios';
import './CreateMovie.css';

const CreateMovie = () => {
    const [movieName, setMovieName] = useState('');
    const [releaseDate, setReleaseDate] = useState('');
    const [cast, setCast] = useState('');
    const [crew, setCrew] = useState('');
    const [poster, setPoster] = useState(null); // State to store poster file
    const [message, setMessage] = useState('');
    const [trailer, setTrailer] = useState('')

    const formatDate = (date) => {
        const dateString = date + "T00:00:00Z";
        const formattedDate = new Date(dateString).toISOString();
        return formattedDate;
    };

    const handlePosterChange = (e) => {
        setPoster(e.target.files[0]); // Store the selected file
    };

    const handleCreateMovie = async () => {
        try {
            const formData = new FormData(); // Create FormData object
            formData.append('poster', poster); // Append poster file to FormData
            formData.append('trailer_url', trailer)
            formData.append('name', movieName);
            formData.append('release_date', formatDate(releaseDate));
            formData.append('release_status', "0");
            formData.append('cast', cast.split(',').map(cast => cast.trim()));
            formData.append('crew', crew.split(',').map(crew => crew.trim()));

            const response = await axios.post('http://13.53.132.117:8080/movies', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data' // Set proper content type for FormData
                }
            });
            setMessage(response.data.message);
        } catch (error) {
            setMessage('Failed to create movie');
        }
    };

    return (
        <div className="venue-page-container">
        <h3 className='h3-css'>Book My Cinema</h3>
        <div className="create-movie-container">
            <h2>Create New Movie</h2>
            <label htmlFor="movieName">Movie Name:</label>
            <input type="text" id="movieName" value={movieName} onChange={(e) => setMovieName(e.target.value)} />
            <br />
            <label htmlFor="releaseDate">Release Date:</label>
            <input type="date" id="releaseDate" value={releaseDate} onChange={(e) => setReleaseDate(e.target.value)} />
            <br />
            <label htmlFor="cast">Cast:</label>
            <input type="text" id="cast" value={cast} onChange={(e) => setCast(e.target.value)} />
            <br />
           
            <label htmlFor="crew">Crew:</label>
            <input type="text" id="crew" value={crew} onChange={(e) => setCrew(e.target.value)} />
            <br />
            <label htmlFor="trailer">Trailer:</label>
            <input type="text" id="trailer" value={trailer} onChange={(e) => setTrailer(e.target.value)} />
            <br />
            <label htmlFor="poster">Poster:</label>
            <input type="file" id="poster" onChange={handlePosterChange} accept="image/*" /> {/* File input for poster */}
            <br /><br></br>
            <button onClick={handleCreateMovie}>Create Movie</button>
            {message && <p>{message}</p>}
        </div>
        </div>
    );
};

export default CreateMovie;
