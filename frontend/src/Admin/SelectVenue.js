import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './SelectVenue.css'; 

const SelectVenue = ({ movieId }) => {
    const [cities, setCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState('');
    const [venues, setVenues] = useState([]);
    const [selectedVenues, setSelectedVenues] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        fetchCities();
    }, []);

    useEffect(() => {
        if (selectedCity) {
            fetchVenues();
        }
    }, [selectedCity]);

    const fetchCities = async () => {
        try {
            const response = await axios.get('http://13.53.132.117:8080/cities');
            setCities(response.data);
        } catch (error) {
            console.error('Error fetching cities:', error);
        }
    };

    const fetchVenues = async () => {
        try {
            const response = await axios.get(`http://13.53.132.117:8080/venues?city=${selectedCity}`);
            if (response.data) {
                setVenues(response.data);
            } else {
                setVenues([]); // Set venues to an empty array when response.data is null
            }
        } catch (error) {
            console.error('Error fetching venues:', error);
        }
    };

    const handleCityChange = (e) => {
        setSelectedCity(e.target.value);
    };

    const handleCheckboxChange = (venueId) => {
        if (selectedVenues.includes(venueId)) {
            setSelectedVenues(selectedVenues.filter(id => id !== venueId));
        } else {
            setSelectedVenues([...selectedVenues, venueId]);
        }
    };

    const handleOpenMovie = async () => {
        try {
            if (!startDate || !endDate) {
                setErrorMessage('Please select both start and end dates.');
                return;
            }

            if (selectedVenues.length === 0) {
                setErrorMessage('Please select at least one venue.');
                return;
            }

            await axios.post(`http://13.53.132.117:8080/movies/open/${movieId}`, {
                city: selectedCity,
                venues: selectedVenues,
                start_date: startDate,
                end_date: endDate
            });
            setErrorMessage('')
            setSuccessMessage('Movie opened successfully');
        } catch (error) {
            console.error('Error opening movie:', error);
            setErrorMessage('Selected venues are not available for the specified date range');
            setSuccessMessage('');
        }
    };

    return (
        <div>
            <h2>Select Venue and Dates</h2>
            <div>
                <label htmlFor="city">Select City:</label>
                <select id="city" value={selectedCity} onChange={handleCityChange}>
                    <option value="">Select</option>
                    {cities.map(city => (
                        <option key={city._id} value={city._id}>{city.city_name}</option>
                    ))}
                </select>
            </div>
            {selectedCity && (
                <div className="venue-container">
                <label>Venues:</label>
                <div className="venue-list">
                {venues && venues.length === 0 && <div>No venues available for selected city</div>}
                    {venues.map(venue => (
                        <div key={venue._id} className="venue-item">
                            <input className='input-css' type="checkbox" id={venue._id} onChange={() => handleCheckboxChange(venue._id)} />
                            <label className='venue-label' htmlFor={venue._id}>{venue.venue_name}</label>
                        </div>
                    ))}
                </div>
            </div>
            
            )}
            <div>
                <label className='date-label'>Start Date:</label>
                <DatePicker className='date-picker' selected={startDate} minDate={new Date()}   onChange={date => setStartDate(date)} />
            </div>
            <div>
                <label className='date-label'>End Date:</label>
                <DatePicker  className='date-picker' selected={endDate} minDate={new Date()}   onChange={date => setEndDate(date)} />
            </div>
            {errorMessage && <div>{errorMessage}</div>}
            <button onClick={handleOpenMovie}>Open Movie</button>
            {successMessage && <div>{successMessage}</div>}
        </div>
    );
};

export default SelectVenue;
